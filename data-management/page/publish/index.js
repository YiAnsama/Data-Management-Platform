/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
axios({
  url: "/v1_0/channels",
  method: "get"
})
  .then(result => {
    // console.log(result);
    const channels = document.querySelector("#channel_id")
    channels.innerHTML = '<option value="" selected="">请选择文章频道</option>' +
      result.data.data.channels.map(ele => {
        return `<option value=${ele.id}>${ele.name}</option>`
      }).join("")
  })
  .catch(error => {
    console.log(error);
  })

/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
const img = document.querySelector("#img")
const img_cover = document.querySelector(".rounded")
let imgURL = ""
// console.log(img);
img.addEventListener("change", () => {
  // console.log(img.files[0]);
  const formData = new FormData()
  formData.append("image", img.files[0])
  axios({
    url: "/v1_0/upload",
    method: "post",
    data: formData
  })
    .then(result => {
      // console.log(result.data.data.url);
      imgURL = result.data.data.url
      img_cover.src = imgURL
      img_cover.style.display = "block"
    })
    .catch(error => {
      console.log(error);
    })
})



/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */

let title = null
let channelID = null
let content = null
window.addEventListener("load", () => {
  title = document.querySelector("#title")
  channelID = document.querySelector("#channel_id")
  setTimeout(() => {
    content = document.querySelector("#editor-container > div > div.ck.ck-reset.ck-editor.ck-rounded-corners > div.ck.ck-editor__main > div")
    //  document.querySelector("#editor-container > div > div.ck.ck-reset.ck-editor.ck-rounded-corners > div.ck.ck-editor__main")
    // console.log(content);
    console.log(content);
  }, 1000)
  console.log('加载完毕');
})

const button = document.querySelector(".btn.btn-primary.send")
button.addEventListener("click", () => {
  // console.log(title, channel_id, imgURL);
  // console.log(content);
  // const content = document.querySelector("#editor-container > div > div.ck.ck-reset.ck-editor.ck-rounded-corners > div.ck.ck-editor__main").innerHTML
  if (button.textContent === "发布") {
    axios({
      url: "/v1_0/mp/articles",
      method: "post",
      data: {
        title: title.value,
        content: content.innerHTML,
        cover: {
          type: 1,
          images: [imgURL]
        },
        channel_id: channelID.value
      }
    })
      .then(result => {
        console.log(result);
        myAlert(true, "文章发布成功!")
        document.querySelector(".art-form").reset()
        setTimeout(() => {
          location.href = "../content/index.html"
        }, 2000)
      })
      .catch(error => {
        console.log(error);
        myAlert(false, error.response.data.message)
      })
  }
})

/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */
// console.log(location.search);
let articleID = null
window.addEventListener("load", () => {
  if (location.search !== "") {
    const id = location.search.slice(4)
    console.log(id);
    document.querySelector(".btn.btn-primary.send").textContent = "修改"
    axios({
      url: `/v1_0/mp/articles/${id}`,
      method: "get"
    })
      .then(result => {
        console.log(result);
        setTimeout(() => {
          img_cover.src = result.data.data.cover.images[0]
          channelID.value = result.data.data.channel_id
          content.innerHTML = result.data.data.content
          title.value = result.data.data.title
          articleID = result.data.data.id
          img_cover.style.display = "block"
        }, 1200)
      })
      .catch(error => {
        console.log(error);
      })
  }
})



/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
button.addEventListener("click", () => {
  if (button.textContent === "修改") {
    axios({
      url: `/v1_0/mp/articles/${articleID}`,
      method: "put",
      data: {
        id: articleID,
        title: title.value,
        channel_id: channelID.value,
        content: content.innerHTML,
        cover: { type: 1, images: [img_cover.src] },
      }
    })
      .then(result => {
        console.log(result);
        myAlert(true, "文章修改成功!")
        document.querySelector(".art-form").reset()
        setTimeout(() => {
          location.href = "../content/index.html"
        }, 2000)
      })
      .catch(error => {
        console.log(error);

      })
  }
})
