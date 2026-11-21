# 陈咏 · 家长教练

面向家长的单页静态介绍：家庭教育咨询（内驱力、学习力、生命力），以及如何用 AI 帮助孩子学习。没有后端，不收集表单信息。

## 本地打开

直接用浏览器打开 `index.html` 即可。

也可以在本目录启动一个静态服务：

```bash
python3 -m http.server 47291
```

然后访问 `http://127.0.0.1:47291/`。

## 放入微信二维码

把二维码图片保存为下面任一文件名，放在 `assets/` 目录：

- `assets/wechat-qr.png`
- `assets/wechat-qr.jpg`
- `assets/wechat-qr.jpeg`
- `assets/wechat-qr.webp`

刷新页面后，图片会出现在联系区域。放入之前，页面只保留空白框，不写电话、微信号、邮箱或地址。

分享给家长之前，请先放好你自己的二维码。

## 发布到公网

站点是纯静态文件，构建命令留空，发布目录就是仓库根目录。

### GitHub Pages

1. 在 GitHub 新建一个 **Public** 仓库。
2. 把本目录推送到该仓库的 `main` 分支。
3. 打开仓库 **Settings → Pages**。
4. **Build and deployment** 选择 **Deploy from a branch**。
5. Branch 选 `main`，Folder 选 `/ (root)`，保存。
6. 一两分钟后，地址形如 `https://<用户名>.github.io/<仓库名>/`。

### Vercel

1. 登录 [vercel.com](https://vercel.com)。
2. **Add New → Project**，导入上面的仓库。
3. Framework Preset 选 **Other**。Build Command 和 Output Directory 都留空。
4. Deploy。完成后会得到 `https://<项目名>.vercel.app`。

`index.html` 里的 `og:image` 已写成 `https://yongfc.github.io/chenyong-parent-coach/assets/share-card.png`。发到微信里时，链接卡片用的是这张绝对地址。

页面上的「小探索」只在浏览器里做选择，不提交、不写入本地存储。

## 文件

- `index.html`：页面
- `styles.css`：样式
- `site.js`：页内展开、场景跳转、小探索、二维码探测
- `favicon.svg`：图标
- `assets/share-card.png`：链接分享图
- `assets/wechat-qr.txt`：二维码放置说明
