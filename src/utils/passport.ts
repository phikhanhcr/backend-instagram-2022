import passport from "passport";
import { Login } from "../modules/User/handles";


passport.serializeUser((user: any, done) => {
  console.log("serializeUser", user._id);
  done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
  console.log("deserializeUser", id);
  Login.isExistingIdUser(id).then((user) => {
    if (user) {
      done(null, id);
    } else {
      done(null, null);
    }
  });
});


// passport.use apple

// passport.use(
//   new AppleStrategy({
//     clientID: process.env.CLIENT_AUTH_ID,
//     teamID: process.env.TEAM_ID,
//     callbackURL: process.env.APPLE_CALLBACK_URL,
//     keyID: process.env.KEY_ID_APPLE,
//     passReqToCallback: true,
//     privateKeyLocation: path.join(__dirname, '../../AuthKey_5G4XP6993Z.p8')

//   }, async (req, accessToken, refreshToken, idToken, profile, cb) => {
//     console.log({ accessToken, refreshToken, idToken, profile })
//     const userInfor = jwt.decode(idToken);
//     console.log({ userInfor });
//     const { email, sub } = userInfor;
//     let user = {
//       apple_id: email,
//       apple_sub : sub
//     }
//     Login.isExistingAppleUser(sub).then((r) => {
//       if (r) {
//         user = Object.assign(user, {
//           _id: r._id,
//           google_id: r.google_id,
//           facebook_id: r.facebook,
//           zalo_id: r.zalo,
//           birthday: r.birthday,
//           gender: r.gender,
//           first_name: r.first_name,
//           last_name: r.last_name,
//           email: email,
//           working_area: {
//             city: r.working_area && r.working_area.city && r.working_area.city.length > 0 ? true : false,
//             district: r.working_area && r.working_area.district && r.working_area.district.length > 0 ? true : false,
//             ward: r.working_area && r.working_area.ward && r.working_area.ward.length > 0 ? true : false,
//             ad_sell_lease_type:
//               r.working_area && r.working_area.ad_sell_lease_type && r.working_area.ad_sell_lease_type.length > 0
//                 ? true
//                 : false,
//             ad_sell_lease_type_option:
//               r.working_area &&
//                 r.working_area.ad_sell_lease_type_option &&
//                 r.working_area.ad_sell_lease_type_option.length > 0
//                 ? true
//                 : false,
//             project: r.working_area && r.working_area.project && r.working_area.project.length > 0 ? true : false,
//           },
//         });
//         cb(null, user);
//       } else {
//         Login.saveNewAppleInfo(email, sub).then((r2) => {
//           user = Object.assign(user, {
//             _id: r2._id,
//             google_id: r2.google_id,
//             facebook_id: r2.facebook,
//             zalo_id: r2.zalo,
//             working_area: {
//               city: false,
//               district: false,
//               ward: false,
//               ad_sell_lease_type: false,
//               ad_sell_lease_type_option: false,
//               project: false,
//             },
//           })
//           cb(null, user);
//         })

//       }

//     })

//   })
// )

// passport.use(
//   new GoogleStrategy(
//     {
//       callbackURL: "/auth/google/callback",
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       let user = {
//         email: profile.emails[0].value,
//         first_name: profile.name.givenName,
//         google_id: profile.id,
//         last_name: profile.name.familyName,
//         avatar: profile.photos[0].value,
//         google_avatar: profile.photos[0].value,
//       };
//       Login.isExistingGmailUser(profile.id, profile.emails[0].value).then((r) => {
//         if (r) {
//           user = Object.assign(user, {
//             _id: r._id,
//             facebook_id: r.facebook,
//             zalo_id: r.zalo,
//             email: r.email,
//             first_name: r.first_name,
//             apple_id: r.apple_id,
//             google_id: r.google_id,
//             last_name: r.last_name,
//             avatar: r.avatar,
//             google_avatar: r.google_avatar,
//             working_area: {
//               city: r.working_area && r.working_area.city && r.working_area.city.length > 0 ? true : false,
//               district: r.working_area && r.working_area.district && r.working_area.district.length > 0 ? true : false,
//               ward: r.working_area && r.working_area.ward && r.working_area.ward.length > 0 ? true : false,
//               ad_sell_lease_type:
//                 r.working_area && r.working_area.ad_sell_lease_type && r.working_area.ad_sell_lease_type.length > 0
//                   ? true
//                   : false,
//               ad_sell_lease_type_option:
//                 r.working_area &&
//                   r.working_area.ad_sell_lease_type_option &&
//                   r.working_area.ad_sell_lease_type_option.length > 0
//                   ? true
//                   : false,
//               project: r.working_area && r.working_area.project && r.working_area.project.length > 0 ? true : false,
//             },
//           });
//           cb(null, user);
//         } else {
//           Login.saveNewGoogleInfo(profile).then((r2) => {
//             user = Object.assign(user, {
//               _id: r2._id,
//               facebook_id: r2.facebook,
//               zalo_id: r2.zalo,
//               apple_id: r2.apple_id,
//               working_area: {
//                 city: false,
//                 district: false,
//                 ward: false,
//                 ad_sell_lease_type: false,
//                 ad_sell_lease_type_option: false,
//                 project: false,
//               },
//             });
//             cb(null, user);
//           });
//         }
//       });
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: `${process.env.URL_API}/auth/facebook/callback`,
//       profileFields: [
//         "id",
//         "email",
//         "last_name",
//         "first_name",
//         "middle_name",
//         "gender",
//         "is_verified",
//         "profileUrl",
//         "picture",
//       ],
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       const profileJson = profile._json;
//       let user = {
//         facebook_id: profileJson.id,
//         facebook_email: profileJson.email,
//         first_name: profileJson.first_name,
//         last_name: profileJson.last_name,
//         facebook_avatar: profileJson.picture.data.url,
//         avatar: profileJson.picture.data.url,
//         email: profileJson.email,
//       };

//       Login.isExistingFacebookUser(profileJson.id).then((r) => {
//         if (r) {
//           user = Object.assign(user, {
//             _id: r._id,
//             google_id: r.google_id,
//             zalo_id: r.zalo,
//             facebook_email: r.facebook_email,
//             apple_id: r.apple_id,
//             first_name: r.first_name,
//             last_name: r.last_name,
//             avatar: r.avatar,
//             email: r.email ? r.email : profileJson.email,
//             working_area: {
//               city: r.working_area && r.working_area.city && r.working_area.city.length > 0 ? true : false,
//               district: r.working_area && r.working_area.district && r.working_area.district.length > 0 ? true : false,
//               ward: r.working_area && r.working_area.ward && r.working_area.ward.length > 0 ? true : false,
//               ad_sell_lease_type:
//                 r.working_area && r.working_area.ad_sell_lease_type && r.working_area.ad_sell_lease_type.length > 0
//                   ? true
//                   : false,
//               ad_sell_lease_type_option:
//                 r.working_area &&
//                   r.working_area.ad_sell_lease_type_option &&
//                   r.working_area.ad_sell_lease_type_option.length > 0
//                   ? true
//                   : false,
//               project: r.working_area && r.working_area.project && r.working_area.project.length > 0 ? true : false,
//             },
//           });
//           cb(null, user);
//         } else {
//           Login.saveNewFacebookInfo(profile).then((r2) => {
//             user = Object.assign(user, {
//               _id: r2._id,
//               google_id: r2.google_id,
//               zalo_id: r2.zalo,
//               apple_id: r2.apple_id,
//               working_area: {
//                 city: false,
//                 district: false,
//                 ward: false,
//                 ad_sell_lease_type: false,
//                 ad_sell_lease_type_option: false,
//                 project: false,
//               },
//             });
//             cb(null, user);
//           });
//         }
//       });
//     }
//   )
// );
// passport.use(
//   new ZaloStrategy(
//     {
//       clientID: process.env.ZALO_APP_ID,
//       clientSecret: process.env.ZALO_APP_KEY,
//       callbackURL: "/auth/zalo/callback",
//     },
//     (accessToken, code, profile, cb) => {
//       let user = {
//         zalo_id: profile.id,
//         birthday: profile.birthday,
//         gender: profile.gender,
//         first_name: profile.name,
//         last_name: "",
//         zalo_avatar: profile.picture.data.url,
//         avatar: profile.picture.data.url,
//         email: "",
//       };

//       Login.isExistingZaloUser(profile.id).then((r) => {
//         if (r) {
//           user = Object.assign(user, {
//             _id: r._id,
//             google_id: r.google_id,
//             facebook_id: r.facebook,
//             apple_id: r.apple_id,
//             birthday: r.birthday,
//             gender: r.gender,
//             first_name: r.first_name,
//             last_name: r.last_name,
//             email: r.email,
//             working_area: {
//               city: r.working_area && r.working_area.city && r.working_area.city.length > 0 ? true : false,
//               district: r.working_area && r.working_area.district && r.working_area.district.length > 0 ? true : false,
//               ward: r.working_area && r.working_area.ward && r.working_area.ward.length > 0 ? true : false,
//               ad_sell_lease_type:
//                 r.working_area && r.working_area.ad_sell_lease_type && r.working_area.ad_sell_lease_type.length > 0
//                   ? true
//                   : false,
//               ad_sell_lease_type_option:
//                 r.working_area &&
//                   r.working_area.ad_sell_lease_type_option &&
//                   r.working_area.ad_sell_lease_type_option.length > 0
//                   ? true
//                   : false,
//               project: r.working_area && r.working_area.project && r.working_area.project.length > 0 ? true : false,
//             },
//           });
//           cb(null, user);
//         } else {
//           Login.saveNewZaloInfo(profile, code).then((r2) => {
//             user = Object.assign(user, {
//               _id: r2._id,
//               google_id: r2.google_id,
//               apple_id: r2.apple_id,
//               facebook_id: r2.facebook,
//               working_area: {
//                 city: false,
//                 district: false,
//                 ward: false,
//                 ad_sell_lease_type: false,
//                 ad_sell_lease_type_option: false,
//                 project: false,
//               },
//             });
//             cb(null, user);
//           });
//         }
//       });
//     }
//   )
// );

export const Passport = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};
