import ProfileValidator from "App/Validators/ProfileValidator";
import Profile from "App/Models/Profile";
import User from "App/Models/User";
import moment from "moment";

class ProfilesController {
  public async getProfile({ auth, response }) {
    try {
      const userData = await auth.user.id;
      const profile = await Profile.findBy("user_id", userData);

      if (profile === null) {
        return response.json({
          message: "user profile is not yet created",
        });
      }
      const userProfile = {
        name: profile?.name,
        email: userData.email,
        gender: profile?.gender,
        dateOfBirth: profile?.dateOfBirth.toLocaleDateString(),
      };

      return response.json(userProfile);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  public async createProfile({ request, response, auth }) {
    try {
      const userData = await auth.user.id;

      const { name, mobileNumber, gender, dateOfBirth } =
        await request.validate(ProfileValidator);

      const existing = await Profile.findBy("user_id", userData);

      if (existing !== null) {
        return response.json({
          message: "User profile is already created",
        });
      }

      const duplicateMobileNumber = await Profile.findBy(
        "mobile",
        mobileNumber
      );

      const date = moment(new Date(dateOfBirth), "DD-MM-YYYY");

      const today = moment();

      if (date.isAfter(today)) {
        return response.status(400).json({
          message: "Date entered is ahead of today's date",
        });
      } else if (duplicateMobileNumber !== null) {
        return response.status(400).json({
          message: "User with same mobile number exist",
        });
      }
      const profile = await Profile.create({
        name,
        mobileNumber,
        gender,
        dateOfBirth,
        userId: userData,
      });

      return response.status(201).json(profile);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  public async deleteProfile({ request, auth, response }) {
    const { mobileNumber } = await request.validate(ProfileValidator);

    const Userprofile = await Profile.findBy("user_id", auth.user.id);

    try {
      if (mobileNumber === Userprofile?.mobileNumber) {
        const user = await User.findBy("id", Userprofile?.userId);

        await Userprofile?.delete();

        await user?.delete();

        return response.json({
          message: "User and user's profile has been deleted",
        });
      }
    } catch (error) {
      return response.status(400).json(error);
    }

    return response.json({
      message: "Mobile number not found",
    });
  }

  public async updateProfile({ response, request, auth }) {
    try {
      const { name, mobileNumber, gender, dateOfBirth } =
        await request.validate(ProfileValidator);

      const userId = auth.user.id;

      const existingProfile = await Profile.findBy("user_id", userId);

      if (!existingProfile) {
        return response.status(400).json({
          message: "Profile is not yet created",
        });
      }

      if (existingProfile.mobileNumber !== mobileNumber) {
        const DuplicateProfile = await Profile.findBy("mobile", mobileNumber);

        if (DuplicateProfile !== null) {
          return response.status(400).json({
            message: "Mobile number already exists",
          });
        }
      } else {
        await Profile.query().where("user_id", userId).update({
          name,
          mobileNumber,
          gender,
          dateOfBirth,
        });

        return response.status(200).json({
          message: "Updated user Successfully",
        });
      }
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}
export default ProfilesController;
