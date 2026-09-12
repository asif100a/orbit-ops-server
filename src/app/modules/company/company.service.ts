import AppError from "../../errorHandlers/AppError";
import { sendOtpEmail } from "../../utils/message.utils";
import { deleteOtp, getOtp, setOtp } from "../../utils/redis.utils";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { type CompanyType } from "./company.interface";
import { CompanyModel } from "./company.model";

export class CompanyService {
  async findAll(): Promise<CompanyType[]> {
    return CompanyModel.find();
  }

  async findById(id: string): Promise<CompanyType | null> {
    return CompanyModel.findById(id)
      .populate("owner", "name email role")
      .populate("admins", "name email role");
  }

  async myCompany(id: string): Promise<CompanyType | null> {
    const response = await CompanyModel.findOne({
      admins: { $in: [new Types.ObjectId(id)] },
    });

    if(!response) {
      throw new AppError(404, "Company not found!");
    }

    return response;
  }

  async create(
    ownerId: string,
    data: Partial<CompanyType>,
  ): Promise<CompanyType> {
    const ownerExists = await User.exists({ _id: ownerId });
    if (!ownerExists) {
      throw new AppError(404, "Owner user not found");
    }

    const existingCompany = await CompanyModel.findOne({
      owner: ownerId,
    });
    if (existingCompany) {
      throw new AppError(409, "This user already owns a company");
    }

    const slug =
      data?.slug ??
      data?.name
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const existingSlug = await CompanyModel.findOne({ slug });
    if (existingSlug) {
      throw new AppError(409, "This company slug is already in use");
    }

    const company = await CompanyModel.create({
      ...data,
      slug,
      owner: ownerId,
      admins: [ownerId],
      plan: "FREE",
      isActive: true,
      isVerified: false,
      onboardingCompleted: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `company-verification:${company._id}`;

    try {
      await setOtp(otpKey, otp, 600);
      await sendOtpEmail({
        to: company.email,
        otp,
      });
    } catch (error) {
      await deleteOtp(otpKey);
      throw new AppError(502, "Failed to send company verification OTP");
    }

    return company;
  }

  async verify(companyId: string, otp: string) {
    const  company = await CompanyModel.findById(companyId);
    if(!company) {
      throw new AppError(404, "Company not found");
    }

    if(company.isVerified) {
      throw new AppError(400, "Company is already verified");
    }

    const storedOtp = await getOtp(`company-verification:${companyId}`)

    if(!storedOtp || storedOtp !== otp) {
      throw new AppError(400, "Invalid or expired OTP")
    }

    const verifiedCompany = await CompanyModel.findByIdAndUpdate(companyId, {isVerified: true, verifiedAt: new Date()}, {
      new: true,
      runValidators: true
    })

    await deleteOtp(`company-verification:${companyId}`)

    return verifiedCompany;
  }

  async subscribe(companyId: string, plan: string): Promise<CompanyType | null> {
    const company = await CompanyModel.findById(companyId);
    if (!company) {
      throw new AppError(404, "Company not found");
    }
    // Implementation for subscription logic
    return company;
  }

  async update(
    id: string,
    data: Partial<CompanyType>,
  ): Promise<CompanyType | null> {
    if (data.email !== undefined) {
      throw new AppError(400, "Company email cannot be changed");
    }

    const company = await CompanyModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!company) {
      throw new AppError(404, "Active company not found");
    }

    return company;
  }

  async delete(id: string): Promise<any> {
    const company = await CompanyModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: { isActive: false, isDeleted: true } },
      { new: true, runValidators: true },
    );

    if(!company) {
      throw new AppError(404, "Company not found")
    }

    return company;
  }
}
