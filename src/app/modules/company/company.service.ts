import AppError from "../../errorHandlers/AppError";
import { deleteOtp, getOtp, setOtp } from "../../utils/redis.utils";
import { AuthService } from "../auth/auth.service";
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

    const authService = new AuthService()

    const otp = authService.generateOtp();

    await setOtp(`company-verification:${company._id}`, otp, 600);

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
      throw new AppError(400, "Invalid or expired token")
    }

    const verifiedCompany = await CompanyModel.findByIdAndUpdate(companyId, {isVerified: true, verifiedAt: new Date()}, {
      new: true,
      runValidators: true
    })

    await deleteOtp(`company-verification:${companyId}`)

    return verifiedCompany;
  }

  async update(
    id: string,
    data: Partial<CompanyType>,
  ): Promise<CompanyType | null> {
    return CompanyModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  async delete(id: string): Promise<any> {
    const company = await CompanyModel.findByIdAndDelete(id, {isActive: false});

    if(!company) {
      throw new AppError(404, "Company not found")
    }

    return company;
  }
}
