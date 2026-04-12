由于A社反华严重，国内想要使用原汁原味的Claude Code非常麻烦。借鉴所谓的“消费降级”，我们可以使用智谱glm大模型+Claude Code框架的方法，合法合规地使用到”性价比版“Claude Code。

首先，简单阐述原理（我不是砖家，只能打比方说明）：Claude Code其实分为Claude Code框架和Claude Code Opus4.6/Sonnet4等大模型。好比你有一台苹果电脑：Claude Code框架就是电脑外壳+键盘+屏幕+操作系统+硬盘，而Opus大模型就是CPU（中央处理器）。

关键来了：Claude Code框架本身是免费的，只是调用A社的大模型需要A社的账号并付费。而注册A社账号需要科学上网，外国手机号，国际银行卡，使用时还要注意你的本机IP（可能被封号）。所以对于像本人这样的非刚需用户，配置一个原装Claude Code费财费力。

但是，智谱做到了国内许多AI厂家没有做到的事：他推出了官方兼容API接口。通俗地说：他直接在自家服务器上做了一层「翻译」，把 Anthropic 的 API 协议转成自家模型能懂的格式。你只需要在Claude Code框架的`settings.json`文件里配置好API信息即可调用国内大模型。这样就避免了注册A社账号和海外付费。

所以，接下来是完整的操作流程（这份教程会非常详细，如果某些步骤你已经会了，请跳过）：


### 一、安装WSL

WSL是windows的Linux子系统，让Claude Code跑在Linux上方便管理服务器。

### 操作步骤

以管理员身份打开PowerShell

- 点击Windows左下角搜索图标
    
- 输入 `PowerShell`
    
- 右键点击“Windows PowerShell”，选择 **“以管理员身份运行”**
    
- 如果弹出用户账户控制窗口，点击“是”
    


在弹出的蓝色窗口中，输入以下命令然后按回车：

```
wsl --install
```

系统会自动：

- 启用WSL功能
    
- 下载并安装Ubuntu Linux系统
    
- 完成后**提示重启电脑**



 首次启动Ubuntu

- 重启后，在开始菜单搜索 `Ubuntu` 并点击打开
    
- 首次打开会提示“正在安装”，等待1-2分钟
    
- 系统会提示你输入**用户名**（全部小写字母，如 `john`）
    
- 然后输入**密码**（输入时屏幕不显示任何字符，这是正常的）
    
- 确认密码

想要再次使用wsl就打开powershell，输入`wsl`，就可以进入Linux系统了。


## 二、安装Node.js

Node.js是一个运行环境，安装Node.js自动会安装npm，npm你可以理解为程序员的应用商城，跟Apple Store是一个意思。Claude Code依赖Node.js运行，需要18.0或更高版本。

在wsl窗口中输入以下命令并回车：

```bash
sudo apt update
```

（首次使用sudo会提示输入密码，输入你刚才设置的密码即可）

安装Node.js

```bash
sudo apt install -y nodejs npm
```

验证安装成功

```bash
node --version
```
如果显示类似 `v18.x.x` 或 `v20.x.x` 的版本号，说明安装成功。

## 第三步：安装Claude Code

在wsl输入
```bash
npm install -g @anthropic-ai/claude-code
```
验证安装完毕
```bash
claude --version
```
返回版本号即为成功。或者输入：
```bash
claude
```
出现云朵图案就安装成功了。但现在还不能用。

## 第四步：获取智谱API Key（并订阅套餐）

先注册账号，然后创建自己的API Key。新人会有免费token额度，不用急着订阅套餐。

需要注意的是：API Key请保存，这相当于密码，泄露了别人可以偷你的token用。

## 第五步：配置Claude Code接入智谱GLM

打开文件管理器，打开Linux的Ubuntu文件夹，找到`.claude`文件夹。
我的路径示例：`"\\wsl.localhost\Ubuntu-24.04\home\yifeng\.claude\"`
然后，如果你发现文件夹里没有`settings.json`文件，自己用VScode新建一个。
```json
{

  "env": {

    "ANTHROPIC_AUTH_TOKEN": "your API Key",

    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",

    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5",

    "API_TIMEOUT_MS": "3000000",

    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1

  }

}
```

那个大模型名'glm-5'供你选择，但必须是智谱的大模型哈。（我猜测应该是”伪装“成Sonnet模型了）

好了，重启power shell，输入`wsl`，输入`claude`。你会看到云朵图案。输入`hi`，如果它也跟你问好，那么恭喜你，成功在国内搭建起了最有性价比，最简单的Claude Code。

接下来讨论一下它的能力：
AI给我的计较是：
### 最终评分对比

| 维度    | 智谱方案   | 原装方案  | 胜出方      |
| ----- | ------ | ----- | -------- |
| 操作体验  | 10/10  | 10/10 | 平手       |
| 代码能力  | 8.5/10 | 9/10  | 原装（小幅领先） |
| 网络可用性 | 10/10  | 4/10  | 智谱       |
| 性价比   | 10/10  | 6/10  | 智谱       |

日常使用绝对没问题。

如果有配置的同学也可以点我的邀请链接，一起白嫖智谱的token。
邀请链接：`https://www.bigmodel.cn/invite?icode=cpOTYGypstnYM6w8oclWLlwpqjqOwPB5EXW6OL4DgqY%3D`

注：千问，Minimax也可以将大模型接入Claude Code，操作完全一样，只是在设置文件里需要更改一下参数。