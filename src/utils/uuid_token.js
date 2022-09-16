import { v4 as uuidv4 } from 'uuid';
// uuid
// 随机生成一个字符串，且每次执行不能发生变化，有课身份持久存储
export const getUUID = () => {
    // 先查看本地存储有无uuid
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    if (!uuid_token) {
        // 没有就生成
        uuid_token = uuidv4()
        localStorage.setItem('UUIDTOKEN', uuid_token)
    }
    return uuid_token
}