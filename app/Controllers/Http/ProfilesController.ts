import ProfileValidator from "App/Validators/ProfileValidator";
import Profile from "App/Models/Profile";
import User from "App/Models/User";
import moment from "moment";
class ProfilesController {
  public async getProfile({ auth, response }) {
    try {
      const profile = await Profile.findBy("user_id", auth.user.id);

      if (profile === null) {
        return response.json({
          message: "user profile is not yet created",
        });
      }
      const userProfile = {
        name: profile?.name,
        email: auth.user.id.email,
        gender: profile?.gender,
        birthDate: moment.utc(profile?.birthDate).format("DD/MM/YYYY"),
      };

      return response.json(userProfile);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  public async createProfile({ request, response, auth }) {
    try {
      const { name, mobile, gender, birthDate } = await request.validate(
        ProfileValidator
      );

      const existing = await Profile.findBy("user_id", auth.user.id);

      if (existing !== null) {
        return response.json(existing);
      }

      const duplicateMobileNumber = await Profile.findBy("mobile", mobile);

      const date = moment(new Date(birthDate), "DD-MM-YYYY");

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
      await Profile.create({
        name,
        mobile,
        gender,
        birthDate,
        userId: auth.user.id,
      });

      const profile = await Profile.find(auth.user.id);
      const formattedDate = moment.utc(profile?.birthDate).format("DD/MM/YYYY");
      return response.status(201).json({
        name: profile?.name,
        mobile: profile?.mobile,
        gender: profile?.gender,
        birthDate: formattedDate,
        userId: auth.user.id,
      });
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  public async deleteProfile({ params, auth, response }) {
    const mobile = params.mobile;

    const Userprofile = await Profile.findBy("user_id", auth.user.id);

    try {
      if (mobile === Userprofile?.mobile) {
        const user = await User.findBy("id", Userprofile?.userId);

        await user?.delete();

        return response.json({
          message: "User and user's profile has been deleted",
        });
      }
    } catch (error) {
      return response.status(400).json(error);
    }

    return response.json({
      message: "profile not found",
    });
  }

  public async updateProfile({ response, request, auth }) {
    try {
      const { name, mobile, gender, birthDate } = await request.validate(
        ProfileValidator
      );

      const existingProfile = await Profile.findBy("user_id", auth.user.id);

      if (existingProfile === null) {
        return response.status(400).json({
          message: "Profile not found",
        });
      }

      if (existingProfile.mobile !== mobile) {
        const DuplicateProfile = await Profile.findBy("mobile", mobile);

        if (DuplicateProfile !== null) {
          return response.status(400).json({
            message: "Mobile number already exists",
          });
        }
      }

      await Profile.query().where("user_id", auth.user.id).update({
        name,
        mobile,
        gender,
        birthDate,
      });
      const updatedProfile = await Profile.findBy("user_id", auth.user.id);

      const userProfile = {
        name: updatedProfile?.name,
        mobile: updatedProfile?.mobile,
        gender: updatedProfile?.gender,
        birthDate: moment.utc(updatedProfile?.birthDate).format("DD/MM/YYYY"),
      };
      return response.status(201).json(userProfile);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}
export default ProfilesController;
