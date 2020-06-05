import React, { Component } from "react";
import throttle from "lodash.throttle";

class helper {
  constructor() {}
}

const DEFAULT_ITEM_HEIGHT = 300;
export default class ScrollView extends Component {
  containerRef = React.createRef();
  scrollRunwayRef = React.createRef();
  state = {
    items: null,
    index: 0,
    last: 10,
    renderItems: [],
    position: 0,
  };

  items = [];
  componentDidMount() {
    // console.log(this.containerRef)
    this.containerRef.current.addEventListener("scroll", this.scrollCallBack);
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

    // -10 从第几个开始， 有10个前置可以当缓存10个
    // + 10 第几个结束之后还有10个后置
    this.fill(this.anchorItem.index - 1, this.lastItem.index + 5);
  };
  scrollCallBack = throttle(this.onScroll, 50, { trailing: true });
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

  anchorItem = {
    index: 0,
    offset: 0,
  };
  // 计算最后一个元素当index
  calculateLastItem = (anchorItem, height) => {
    if (height <= 0) return this.lastItem;
    let delta = height + anchorItem.offset;
    if (anchorItem.offset === 0) {
      // viewport高度 / height
      const itemNum = Math.floor(delta / DEFAULT_ITEM_HEIGHT);
      delta -= itemNum * DEFAULT_ITEM_HEIGHT;
      return { index: itemNum, offset: delta };
    }
    let i = anchorItem.index;
    while (
      height > 0 &&
      this.items[i] &&
      height > (this.items[i].height || DEFAULT_ITEM_HEIGHT)
    ) {
      height -= this.items[i].height || DEFAULT_ITEM_HEIGHT;
      i++;
    }
    if (i - this.lastItem.index > 3) {
      console.log(this.items, i, this.lastItem);
    }
    return {
      index: i,
      offset: height,
    };
  };

  calculateItem = (anchorItem, height) => {
    if (height <= 0) return anchorItem;

    height += anchorItem.offset;
    let i = anchorItem.index;
    while (
      height > 0 &&
      i < this.items.length &&
      this.items[i] &&
      (this.items[i].height || DEFAULT_ITEM_HEIGHT) < height
    ) {
      height -= this.items[i].height || DEFAULT_ITEM_HEIGHT;
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
    // this.setState({
    //   first: first,
    //   last,
    // });
    this.attachContent(first, last);
  };

  attachContent = (first, last) => {
    for (let i = first; i < last; i++) {
      let count = 0;
      while (this.items.length <= i) {
        // 没有更多了
        if (!this.props.data[i]) break;
        count++;
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

      // 记录每个item高度
      for (let i = this.anchorItem.index; i < itemElements.length; i++) {
        this.items[i].height = itemElements[i].offsetHeight;
      }
      this.anchorScrollTop = 0;
      for (let i = 0; i < this.anchorItem.index; i++) {
        this.anchorScrollTop += this.items[i].height;
      }

      position = this.anchorScrollTop;
      this.anchorScrollTop += this.anchorItem.offset;

      for (let i = this.anchorItem.index; i > first; i--) {
        position -= this.items[i - 1].height;
      }
      console.log(this.anchorScrollTop, this.containerRef.current.scrollTop);

      //this.scrollRunwayRef.current.style.height = position + "px";
      const renderItems = this.items.slice(first, 17);

      this.setState(
        {
          renderItems,
          position,
        },
        () => {
          // this.containerRef.current.scrollTop = this.anchorScrollTop;
        }
      );
    }
  };

  render() {
    return (
      <div
        className="srollway"
        style={{
          width: "100%",
          height: "100%",
          overflow: "scroll",
          paddingTop: this.state.position,
        }}
        ref={this.containerRef}
      >
        <div
          id="scrollRunway_"
          style={{
            paddingTop: this.state.position,
            width: "1px",
            //transition: "all 0.2s ease 0s",
            // transform: "translate(0px, 4618px)",
          }}
          ref={this.scrollRunwayRef}
        ></div>
        <div
          className="items"
          //style={{ paddingTop: this.state.position }}
        >
          {this.state.renderItems.map(this.props.renderItem)}
        </div>
      </div>
    );
  }
}
