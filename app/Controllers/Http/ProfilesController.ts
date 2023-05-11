import ProfileValidator from "App/Validators/ProfileValidator";
import Profile from "App/Models/Profile";
import User from "App/Models/User";
import moment from "moment";

export default class ProfilesController {
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

      return userProfile;
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  public async createProfile({ request, response, auth }) {
    try {
      const userData = await auth.user.id;

      const { name, mobileNumber, gender, dateOfBirth } =
        await request.validate(ProfileValidator);

      const duplicateMobileNumber = await Profile.findBy(
        "mobile",
        mobileNumber
      );

      const age = moment().diff(new Date(dateOfBirth), "years");

      if (age < 18 || age > 100) {
        return response.status(400).json({
          message: "Age should between 18 to 100",
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
      console.log(error);

      return response.status(400).json(error);
    }
  }

  public async deleteProfile({ request, auth, response }) {
    const mobileNumber = request.input("mobileNumber");

    const profile = await Profile.findBy("user_id", auth.user.id);

    try {
      if (mobileNumber === profile?.mobileNumber) {
        const user = await User.findBy("id", profile?.userId);

        await profile?.delete();

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

      await Profile.query().where("user_id", auth.user.id).update({
        name,
        mobileNumber,
        gender,
        dateOfBirth,
      });

      return response.status(201).json({
        message: "Updated user Successfully",
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json(error);
    }
  }
}
