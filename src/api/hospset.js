import request from '@/utils/request'
// 分页查询
export function getHospSetListApi(pageNum,pageSize,data) {
  return request({
    url: `/admin/hosp/hospitalSet/findPage/${pageNum}/${pageSize}`,
    method: 'POST',
    data
  })
}
// 删除

export function delHospSetApi(data) {
  return request({
    url: `/admin/hosp/hospitalSet/delHospSetByIds`,
    method: 'DELETE',
    data
  })
}
// 锁定
export function lockHospSetApi(id,status) {
  return request({
    url: `/admin/hosp/hospitalSet/lockHospSet/${id}/${status}`,
    method: 'PUT',
  })
}