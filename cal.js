/* 
    *****| Code chỉ dành cho sinh viên GTS |*****
    - Truy cập trang sinh viên: https://sv.ut.edu.vn
    - Đăng nhập tải khoản sinh viên
    - Vào trang "Kết quả học tập" -> https://sv.ut.edu.vn/Xemdiem.aspx
    - Copy đoạn code bên dưới và past ở tab console của chrome.
    - Author : Tuong
    - ExtendFrom : https://github.com/duongle305/calculate/blob/master/Calc.js - Author : DuongLe :
       +{
            resuse getAllCourses => getAllCoursesIntoSemesters
        }
*/
// Danh sách mã môn học không cộng vào điểm trung bình tích lũy chi tiết tại: https://sv.ut.edu.vn/XemChuongTrinhKhung.aspx
excludeCourses = ['007006', '004001', '007007', '004002', '007008', '004003'];
function A_template(a_n){
    let sum=0
    let sum_credit=0
    a_n.forEach(course => {
        sum += course['credit']*course['score']
        sum_credit+=course['credit']
    });
    return Math.round((sum/sum_credit) * 100) / 100
}
function B_template(b_n){
    let sum=0
    let sum_credit=0
    b_n.forEach(course => {
        if(!excludeCourses.includes(course['code']) && course["score"]>=1){
            sum += course['credit']*course['score']
            sum_credit+=course['credit']
        }
    });
    return Math.round((sum/sum_credit) * 100) / 100
}
function getAllCoursesIntoSemesters() {
    $table = $('.tblKetQuaHocTap');
    $trs = this.$table.find('tr');
    let semesters=[]
    let semester = {
        name: '',
        courses: []
    };
    for (let index = this.$trs.length - 4; index > 2; index--) {
        let $tr = $(this.$trs[index]);
        let course = Object.create({});
        if ($tr.children().length > 1) {
            course.code = $tr.children()[1].innerText.trim();
            course.credit = parseInt($tr.children()[4].innerText.trim());
            if ($tr.children().length === 17) {
                course.score = $tr.children()[13].innerText.trim();
            } else {
                course.score = $tr.children()[10].innerText.trim();
            }
            course.score = parseFloat(course.score);
            semester.courses.push(course);
        }
        if ($tr.hasClass('quater')) {
            semester.tr = $tr;
            semester.name = $tr.text().trim();
            semesters.push(semester);
            semester = {
                name: '',
                courses: [],
            };
        }
    }
    return semesters.reverse();
}

function check_course_duplicate(courses,a_n){
    for (let index = a_n.length-1; index >= 0; index--) {
        const course = a_n[index]
        for (let i_ = 0; i_ < courses.length; i_++) {
            const _course = courses[i_]            
            if(course["code"]==_course["code"]){
                if(course["score"]>_course["score"]){
                    courses[i_] = course
                    a_n.splice(index,1)
                }
            }
        }
    }
}
function let_do_it(){
    let semesters = getAllCoursesIntoSemesters()
    let courses=[]
    for (let index = 0; index < semesters.length; index++) {
        const semester = semesters[index];
        a_n = semester["courses"]
        A = A_template(a_n)
        $(semester.tr.children()[0]).append(` - <span style="color: darkred; font-weight: bold;">${A}</span>`);        
        check_course_duplicate(courses,a_n)
        courses = courses.concat(a_n)
        B = B_template(courses)
        $(semester.tr.children()[0]).append(` - TBTL: <span style="color: darkred; font-weight: bold;">${B}</span>`);
    }
}
(()=>{
    let_do_it()
})()
