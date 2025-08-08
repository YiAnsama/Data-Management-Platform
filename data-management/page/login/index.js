/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */

const mobile = document.querySelector('.form-control[name="mobile"]')
const code = document.querySelector('.form-control[name="code"]')
const button = document.querySelector('.btn')
console.log(mobile, code, button);

//登录
button.addEventListener("click", () => {
  if (mobile.value.length !== 11 || code.value.length !== 6) {
    console.log("输入的手机号或验证码不正确!");
  }
  else {
    axios({
      url: "/v1_0/authorizations",
      method: "post",
      data: {
        mobile: mobile.value,
        code: code.value
      }

    }).then(result => {
      // console.log(result);
      myAlert(true, "登录成功")
      localStorage.setItem("token", result.data.data.token)
      setTimeout(() => {
        location.href = "../content/index.html"
      }, 1500)
    })
      .catch(error => {
        // console.log(error.response.data.message);
        myAlert(false, error.response.data.message)
      })
  }

})


