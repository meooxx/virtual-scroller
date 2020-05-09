import React, { Component } from "react";

class helper {
  constructor() {}
}

const DEFAULT_ITEM_HEIGHT = 100;
export default class ScrollView extends Component {
  ref = React.createRef();
  items = [];
  componentDidMount() {
    document.addEventListener("scroll", this.onScroll);
    this.onScroll();
  }
  componentWillUnmount() {}

  onScroll = () => {
    const lastItem = this.calculateLastItem(
      this.anchor,
      this.ref.current.offsetHeight
    );

    // -10 从第几个开始， 有10个前置可以当缓存10个
    // + 10 第几个结束之后还有10个后置
    this.fill(this.anchorItem.index - 10, lastItem.index + 10);
    console.log(lastItem);
  };
  anchor = {
    index: 0,
    offset: 0,
  };
  // 计算最后一个元素当index
  calculateLastItem = (anchorItem, height) => {
    let delta = height + anchorItem.offset;
    // viewport高度 / height
    const itemNum = Math.floor(delta / DEFAULT_ITEM_HEIGHT);
    delta -= itemNum * DEFAULT_ITEM_HEIGHT;
    return { index: itemNum, offset: delta };
  };

  // fill
  fill = (start = 0, end) => {
    const first = Math.max(start, 0);
    const last = end;
    this.attachContent(first, last);
  };

  attachContent = (first, last) => {
    for (let i = first; i < last; i++) {
      while (this.items.length <= i) {
        this.items.push({
          data: { ...this.props.data[i] },
          height: 0,
          width: 0,
          top: 0,
        });
      }
    }
  };

  render() {
    return (
      <div
        className="srollway"
        style={{ width: "100%", height: "100%" }}
        ref={this.ref}
      >
        <div
          id="scrollRunway_"
          style={{
            position: "absolute",
            height: "1px",
            width: "1px",
            transition: "transform 0.2s ease 0s",
            transform: "translate(0px, 4618px)",
          }}
        ></div>
        {/* <div>{this.props.data.map(this.props.renderItem)}</div> */}
      </div>
    );
  }
}
