1、禁用body和html的弹性滚动，将滚动行为禁止在内部容器
```css
html, body {
  height: 100%;
  overflow: hidden;
  position: fixed;
  width: 100%;
}

.scroll-container {
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* 启用 iOS 惯性滚动 */
}
```
2、监听touchmove事件阻止默认行为
```js
document.body.addEventListener('touchmove', function(e) {
  if (!e.target.closest('.scrollable')) {
    e.preventDefault();
  }
}, { passive: false });
```
```css
.scrollable {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: 300px; /* 或其他固定/动态高度 */
}
```