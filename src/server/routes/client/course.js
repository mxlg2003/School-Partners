const router = require('koa-router')()
const { query } = require('../../utils/query')
const { QUERY_TABLE, INSERT_TABLE, UPDATE_TABLE, DELETE_TABLE } = require('../../utils/sql');
const parse = require('../../utils/parse')

router.get('/courses', async (ctx) => {
  const response = []
  const res = await query(QUERY_TABLE('course_list'));
  res.map((item, index) => {
    const { course_cid, course_name, is_recommend } = item
    response[index] = {
      courseCid: course_cid,
      courseName: course_name,
      isRecommend: is_recommend
    }
  })
  ctx.response.body = parse(response);
})

router.get('/courses/:cid', async (ctx) => {
  const cid = ctx.params.cid
  const response = []
  const res = await query(`SELECT * FROM course_info WHERE course_cid = ${cid}`);
  res.map((item, index) => {
    const { course_cid, course_author, publish_date, course_views, course_description, step_name, step_detail, course_rate } = item
    const date = new Date(Number(publish_date))
    const year = date.getFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getDate()
    response[index] = {
      courseAuthor: course_author,
      publishDate: `${year}.${month}.${day}`,
      courseViews: course_views,
      courseDescription: course_description,
      stepName: JSON.parse(step_name),
      stepDetail: JSON.parse(step_detail),
      courseRate: course_rate
    }
  })
  ctx.response.body = parse(response);
})

router.put('/courses', async (ctx) => {
  const data = {
    key: ['course_cid', 'course_name', 'is_recommend'],
    value: ctx.request.body.value
  }
  await query(INSERT_TABLE('course_list', data));
  ctx.response.body = await query(QUERY_TABLE('course_list'));
})

module.exports = router