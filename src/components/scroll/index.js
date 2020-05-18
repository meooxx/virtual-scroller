import React, { Component } from "react";

class helper {
  constructor() {}
}

const DEFAULT_ITEM_HEIGHT = 100;
export default class ScrollView extends Component {
  containerRef = React.createRef();
  scrollRunwayRef = React.createRef();
  state = {
    items: null,
  };
  items = [];
  componentDidMount() {
    // console.log(this.containerRef)
    this.containerRef.current.addEventListener("scroll", this.onScroll);
  }
  componentWillUnmount() {}
  componentDidUpdate(nextProps) {
    if (
      !this.state.items ||
      this.state.sealItems.length !== nextProps.data.length
    ) {
      this.setState(
        {
          items: nextProps.data,
          sealItems: nextProps.data,
        },
        () => {
          this.onScroll();
        }
      );
    }
  }

  onScroll = () => {
    const delta =
      this.containerRef.current.scrollTop - this.anchorScrollTop || 0;

    //  console.log(this.containerRef.current.scrollTop, "delta");
    this.anchorItem = this.calculateItem(this.anchorItem, delta);
    this.lastItem = this.calculateLastItem(
      this.anchorItem,
      this.containerRef.current.offsetHeight
    );
    // console.log(this.lastItem);

    // -10 从第几个开始， 有10个前置可以当缓存10个
    // + 10 第几个结束之后还有10个后置
    this.fill(this.anchorItem.index - 10, this.lastItem.index + 10);
  };
  anchorItem = {
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

  calculateItem = (anchorItem, height) => {
    if (height === 0) return anchorItem;
    height += anchorItem.offset;
    let i = anchorItem.index;
    while (
      height > 0 &&
      i < this.items.length &&
      this.items[i] &&
      (this.items[i].height || DEFAULT_ITEM_HEIGHT) < height
    ) {
      height -= this.items[i].height;
      i++;
    }
    return {
      index: i,
      offset: height,
    };
  };

  // fill
  fill = (start = 0, end) => {
    const first = Math.max(start, 0);
    const last = end;
    this.attachContent(first, last);
  };

  attachContent = (first, last) => {
    // console.log(first, last);
    for (let i = first; i < last; i++) {
      while (this.items.length <= i) {
        // 没有更多了
        if (!this.props.data[i]) break;
        this.items.push({
          data: { ...this.props.data[i] },
          height: 0,
          width: 0,
          top: 0,
        });
      }
    }
    const hasData = this.items.every((i) => !!i.data);
    let position = 0;
    if (hasData) {
      const itemElements = this.containerRef.current.querySelector(".items")
        .children;
      // console.log(itemElements);

      for (let i = 0; i < itemElements.length; i++) {
        position += itemElements[i].offsetHeight;
        this.items[i].height = itemElements[i].offsetHeight;
      }
      this.anchorScrollTop = 0;
      for (let i = 0; i < this.anchorItem.index; i++) {
        this.anchorScrollTop += this.items[i].height;
      }

      // 重新设置 scroll position
      let curPos = this.anchorScrollTop;
      this.anchorScrollTop += this.anchorItem.offset;
      for (let i = this.anchorItem.index; i > this.firstItem; i--) {
        curPos -= this.items[i - 1].height;
      }
      for (let i = this.anchorItem.index; i < this.firstItem; i++) {
        curPos += this.items[i].height;
      }
      this.scrollRunwayRef.current.style = "translate(0, " + position + "px)";
      this.containerRef.current.scrollTop = this.anchorScrollTop;
    }
  };

  render() {
    return (
      <div
        className="srollway"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        ref={this.containerRef}
      >
        <div
          id="scrollRunway_"
          style={{
            position: "absolute",
            height: "1px",
            width: "1px",
            transition: "transform 0.2s ease 0s",
            // transform: "translate(0px, 4618px)",
          }}
          ref={this.scrollRunwayRef}
        ></div>
        <div className="items">
          {this.state.items && this.state.items.map(this.props.renderItem)}
        </div>
      </div>
    );
  }
}
