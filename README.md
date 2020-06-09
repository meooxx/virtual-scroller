This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Introduction

这个项目只是用于学习 virtual list 原理使用, 只实现了关键的部分(下滑部分。上滑的话逻辑和下滑是一样的,只是计算相反去算,懒得去实现了)。不可用于`生产环境` or `You will be fired`

- 使用俩个指针`first`, `last` 记录元素。根据当前滚动位置, 和视口高度计算出第一个元素, 和最后一个元素
- `first` 和 `last` 并不和第一个显示的元素和最后一个元素相等, 因为会在可视区域前和最后缓存特定几个元素
- 首次渲染的高度使用一个固定高度去计算, 下次一滚动再计算就会有准确的高度
- 计算的话每次滚动时候计算, 使用已经渲染了的元素高度, 这样的高度准确
- 元素滚动出可视区域后, 不 render 该元素然后使用 等高的 padding 填充替换
- 每次滚动重新定位 scrollTop

```js
const items = [
  { data: {}, height: "" },
  { data: {}, height: "" },
  { data: {}, height: "" },
  { data: {}, height: "" },
];
items.slice(first, last).map(renderItem);
```

## Inspired By

- [Article:Developers.google.com,Complexities of an Infinite Scroller](https://developers.google.com/web/updates/2016/07/infinite-scroller);[source-code:ui-element-samples/infinite-scroller ](git@github.com:GoogleChromeLabs/ui-element-samples.git)
- [source-code:gitlab/virtual-scroller](https://gitlab.com/catamphetamine/virtual-scroller)
- [Article from a Twitter developer:Infinite List and React](https://itsze.ro/blog/2017/04/09/infinite-list-and-react.html)
