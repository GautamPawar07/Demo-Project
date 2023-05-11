// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ProfileValidator from "App/Validators/ProfileValidator";
import Profile from "App/Models/Profile";

export default class ProfilesController {
  public async getProfile({ response }) {}

  public async createProfile({ request, response }) {
    try {
      const { name, mobileNumber, gender, dateOfBirth } =
        await request.validate(ProfileValidator);

      const profile = await Profile.create({
        name,
        mobileNumber,
        gender,
        dateOfBirth,
      });

      return response.status(201).json(profile);
    } catch (error) {
      console.log(error);
      // return response.send({message : "Profile creation failed"})

      return error;
    }
  }

  public async deleteProfile({}){

  }
}
