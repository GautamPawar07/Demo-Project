import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ProfileValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),

    mobileNumber: schema.string({}, [
      rules.required(),
      rules.regex(/^[0-9]{10}$/),
      rules.minLength(10),
      rules.maxLength(10),
    ]),

    gender: schema.enum(["MALE", "FEMALE"], [rules.required()]),

    dateOfBirth: schema.date({
      format: "dd-MM-yyyy",
    }),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    "name.minLength": "Name must contain minimum 3 characters",

    "name.maxLength": "Name must contain maximum 30 characters",

    "mobileNumber.required": "Mobile Number is required",

    "mobileNumber.regex": "Mobile number must contain 10 digits ",

    "mobileNumber.minLength": "Mobile number must contain 10 digits ",

    "mobileNumber.maxLength": "Mobile number must contain 10 digits ",

    "gender.required": "gender in required",

    "dateOfBirth.date": "date must be in  valid date format",
  };
}
