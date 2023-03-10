import courseModel from "../../models/courseModel.js";
import userModel from "../../models/userModel.js";
import accountModel from "../../models/accountModel.js";
import multer from "multer";
import bcrypt from "bcryptjs";

class tProfileController {
  async index(req, res) {
    const course = await userModel.getAllCourseOfTeacher(
      res.locals.lcAuthTeacher.id
    );
    for (let i = 0; i < course.length; i++) {
      const Rated = await courseModel.getAvgRate(course[i].id);
      const sumRate = await courseModel.getCountFeedback(course[i].id);
      const numberStudent = await userModel.getNumberStudentByCourse(
        course[i].id
      );
      const chapter = await courseModel.getAllChapterOfCourse(course[i].id);
      for (let i = 0; i < chapter.length; i++) {
        chapter[i].index = i + 1;
        chapter[i].lesson = await courseModel.getAllLessonOfChapter(
          chapter[i].id
        );
        for (let j = 0; j < chapter[i].lesson.length; j++) {
          chapter[i].lesson[j].index = j + 1;
          j === chapter[i].lesson.length - 1 && i === chapter.length - 1
            ? (chapter[i].lesson[j].checkLesson = true)
            : (chapter[i].lesson[j].checkLesson = false);
        }
        i === chapter.length - 1 && chapter[i].lesson.length === 0
          ? (chapter[i].checkChapter = true)
          : (chapter[i].checkChapter = false);
        i === chapter.length - 1
          ? (chapter[i].check = true)
          : (chapter[i].check = false);
      }
      course[i].chapter = chapter;
      course[i].rated = (+Rated).toFixed(1);
      course[i].sumRate = (+sumRate).toFixed(0);
      course[i].numberStudent = (+numberStudent).toFixed(0);
      course[i].index = i + 1;
    }
    const [teacher] = await userModel.getInforTeacherByID(
      res.locals.lcAuthTeacher.id
    );
    teacher.courses = course.length;
    teacher.student = await userModel.getNumberStudentOfTeacher(
      res.locals.lcAuthTeacher.id
    );
    teacher.countReview = await userModel.getNumberViewsOfTeacher(
      res.locals.lcAuthTeacher.id
    );
    const isProfile = true;
    res.render("vwteacher/teacherProfile", {
      course,
      isProfile,
      teacher,
      layout: "main",
    });
  }
  async updateImage(req, res) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "src/public/images/teacherPictures");
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + res.locals.lcAuthTeacher.id + ".jpg");
      },
    });
    const upload = multer({ storage: storage });
    upload.single("image")(req, res, async function (err) {
      if (req.file !== undefined)
        await userModel.updateImage(
          res.locals.lcAuthTeacher.id,
          "/images/teacherPictures/" + req.file.filename
        );

      if (err) console.error(err);
      else {
        if (req.file !== undefined)
          req.session.authTeacher.img =
            "/images/teacherPictures/" + req.file.filename;
        return res.redirect("back");
      }
    });
  }
  async updateAccount(req, res) {
    const [password] = await userModel.getInforTeacherByID(
      res.locals.lcAuthTeacher.id
    );
    const ret = bcrypt.compareSync(req.body.passwordCurrent, password.password);

    if (ret) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.passwordCurrent, salt);
      const teacher = {
        id: password.id,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        about: req.body.about,
      };
      await userModel.updateTeacher(teacher);
      return res.redirect("/teacher/profile");
    } else {
      const course = await userModel.getAllCourseOfTeacher(
        res.locals.lcAuthTeacher.id
      );
      for (let i = 0; i < course.length; i++) {
        const Rated = await courseModel.getAvgRate(course[i].id);
        const sumRate = await courseModel.getCountFeedback(course[i].id);
        const numberStudent = await userModel.getNumberStudentByCourse(
          course[i].id
        );
        course[i].rated = (+Rated).toFixed(1);
        course[i].sumRate = (+sumRate).toFixed(0);
        course[i].numberStudent = (+numberStudent).toFixed(0);
      }
      const [teacher] = await userModel.getInforTeacherByID(
        res.locals.lcAuthTeacher.id
      );
      teacher.name = req.body.name;
      teacher.email = req.body.email;
      teacher.courses = course.length;
      teacher.student = await userModel.getNumberStudentOfTeacher(
        res.locals.lcAuthTeacher.id
      );
      teacher.countReview = await userModel.getNumberViewsOfTeacher(
        res.locals.lcAuthTeacher.id
      );
      const isProfile = true;

      return res.render("vwteacher/teacherProfile", {
        course,
        teacher,
        isProfile,
        // layout: "teacher",
        err_message_password: "password is incorrect",
      });
    }
  }
}
export default new tProfileController();
