import { validationErrors } from "../../utils/constants";
import * as Yup from "yup";

export const UserCreateScheme = Yup.object().shape({
  //Flag
  updating: Yup.boolean(),

  idCard: Yup.string()
    .max(15, validationErrors.user.idCard.max)
    .when("updating", {
      is: false,
      then: Yup.string().required(validationErrors.user.idCard.required),
    }),
  username: Yup.string()
    .min(5, validationErrors.user.username.min)
    .max(75, validationErrors.user.username.max)
    .when("updating", {
      is: false,
      then: Yup.string().required(validationErrors.user.username.required),
    }),
  fullName: Yup.string()
    .min(5, validationErrors.user.fullName.min)
    .max(100, validationErrors.user.fullName.max)
    .when("updating", {
      is: false,
      then: Yup.string().required(validationErrors.user.fullName.required),
    }),
  password: Yup.string()
    .min(5, validationErrors.user.password.min)
    .max(50, validationErrors.user.password.max)
    .when("updating", {
      is: false,
      then: Yup.string().required(validationErrors.user.password.required),
    }),

  urbanization: Yup.object().test(
    "validate-urbanization",
    validationErrors.user.urbanization.required,
    (value, testContext) =>
      !(testContext.parent.role === "002" && Object.keys(value).length === 0)
  ),

  family: Yup.array().test(
    "validate-family",
    validationErrors.user.family.required,
    (value, testContext) =>
      !(testContext.parent.role === "003" && value?.length === 0)
  ),

  role: Yup.string().required(validationErrors.user.role.required),
  email: Yup.string()
    .email(validationErrors.user.email.valid)
    .max(50, validationErrors.user.email.max)
    .required(validationErrors.user.email.required),
  phone: Yup.string()
    .matches(/^\d+$/, validationErrors.user.phone.valid)
    .max(15, validationErrors.user.phone.max),
});
