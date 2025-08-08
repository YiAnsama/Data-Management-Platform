/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
// axios({
//   url: "/v1_0/user/profile",
//   method: "get",
// })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(error => {
//     console.log(error);
//   })

/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */

//设置频道列表
axios({
  url: "/v1_0/channels",
  post: "get"
})
  .then(result => {
    document.querySelector('[name="channel_id"]').innerHTML =
      '<option value="" selected="">全部</option>' +
      result.data.data.channels.map(ele => {
        return `<option value=${ele.id}>${ele.name}</option>`
      }).join("")
  })

//查询参数
let current_status = ''
let channel_id = ''
let pages = 0 //总页数

//监听查询参数的改变
const radioGroup = document.querySelector("#radioGroup")
radioGroup.addEventListener("change", e => {
  const checkedRadio = document.querySelector('input[name="status"]:checked')
  current_status = checkedRadio ? checkedRadio.value : ''
  console.log(current_status);
})
document.querySelector(".form-select[name=channel_id]").addEventListener("change", function () {
  channel_id = this.value
  console.log(this.value);
})

//点击筛选,获取匹配的数据,渲染到界面

//获取并渲染数据
function getArticles(page = "1") {
  axios({
    url: "/v1_0/mp/articles",
    method: "get",
    params: {
      status: current_status,
      channel_id: channel_id,
      page: page,
      per_page: "3"
    }
  })
    .then(result => {
      // console.log(result);
      // console.log(typeof page);
      if (typeof page == "object") page = 1
      pages = parseInt(result.data.data.total_count / 3) + 1
      // console.log('pages:', pages, "page:", page);
      document.querySelector('[name="page"]').innerHTML = `第${page}页`
      document.querySelector(".total-count.page-now").innerHTML = `共${result.data.data.total_count}条`
      const article_list = document.querySelector(".align-middle.art-list")
      // console.log(article_list);
      // console.log(result.data.data.results);
      if (result.data.data.results.status == '1') {
        article_list.innerHTML = result.data.data.results.map(ele => {
          return `<tr>
                  <td>
                    <img src=${ele.cover.images[0]} alt="">
                  </td>
                  <td>${ele.title}</td>
                  <td>
                    <span class="badge text-bg-primary">待审核</span>
                  </td>
                  <td>
                    <span>${ele.pubdate}</span>
                  </td>
                  <td>
                    <span>${ele.read_count}</span>
                  </td>
                  <td>
                    <span>${ele.comment_count}</span>
                  </td>
                  <td>
                    <span>${ele.like_count}</span>
                  </td>
                  <td id="${ele.id}">
                    <i class="bi bi-pencil-square edit"></i>
                    <i class="bi bi-trash3 del"></i>
                  </td>
                </tr>`
        }).join("")
      }
      else {
        article_list.innerHTML = result.data.data.results.map(ele => {
          return `<tr>
                  <td>
                    <img src=${ele.cover.images[0]} alt="">
                  </td>
                  <td>${ele.title}</td>
                  <td>
                    <span class="badge text-bg-success">审核通过</span>
                  </td>
                  <td>
                    <span>${ele.pubdate}</span>
                  </td>
                  <td>
                    <span>${ele.read_count}</span>
                  </td>
                  <td>
                    <span>${ele.comment_count}</span>
                  </td>
                  <td>
                    <span>${ele.like_count}</span>
                  </td>
                  <td id="${ele.id}">
                    <i class="bi bi-pencil-square edit"></i>
                    <i class="bi bi-trash3 del"></i>
                  </td>
                </tr>`
        }).join("")
      }

    })
    .catch(error => {
      console.log(error);
    })
}
getArticles()
document.querySelector(".btn.btn-primary.sel-btn").addEventListener("click", getArticles)
/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */

const page = document.querySelector(".page-item.page-now[name='page']")
// console.log(page.value);

document.querySelector("#prev").addEventListener("click", () => {
  if (page.value >= 2) {
    page.value--;
    getArticles(page.value)
  }
  else {
    alert("已是第一页")
  }
})
document.querySelector("#next").addEventListener("click", () => {
  if (page.value < pages) {
    page.value++;
    getArticles(page.value)
  }
  else {
    alert("已是最后一页")
  }
})


/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
document.querySelector(".align-middle.art-list").addEventListener("click", e => {
  if (e.target.className === "bi bi-trash3 del") {
    // console.log(e.target);
    // console.log(e.target.parentNode.id);
    if (confirm("是否删除?")) {
      axios({
        url: `/v1_0/mp/articles/${e.target.parentNode.id}`,
        method: "delete"
      })
        .then(result => {
          // console.log(result);
          getArticles(page)
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
  // 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
  else if (e.target.className === "bi bi-pencil-square edit") {
    location.href = `../publish/index.html?id=${e.target.parentNode.id}`
  }
})


