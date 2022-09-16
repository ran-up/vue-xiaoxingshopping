// 防抖：高频触发事件后，再次被触发，则重新计时，也就是只取最后一次的数据
export const debounce = (fn, delay) => {
    let content = this, timer = null;
    return function () {
        if (timer) clearTimeout(timer);
        // let args = arguments;
        timer = setTimeout(() => {
            fn.apply(content, ...arguments);
        }, delay);
    };
}