# tikka

插件式的打包工具 📦。

执行文件到文件的转换，不会打包为一个`bundle`文件。

## 安装

```shell
npm install tikka --save-dev
```

```shell
yarn add tikka --dev
```

## 使用

tikka 提供了 CLI 的方式。

```shell
tikka --source src --format commonjs module --outDir lib esm --declaration
```

## JavaScript API

如果需要自定义配置，可以使用 API 的方式来进行打包。

```javascript
import { compile, transform, transformDeclaration, transformLess, withPostcss, transformSass } from 'tikka'

compile({
  source: 'src',
  outDir: 'dist',
})
  .tasks(
    transform({
      format: 'module',
    }),
    transformDeclaration,
    transformLess,
    transformSass
  )
  .run()
```

- [`compile` 执行打包](https://github.com/zhangyu1818/tikka#compile)
- [`transform`转换代码文件](https://github.com/zhangyu1818/tikka#transform)
- [`transformDeclaration`转换TypeScript定义](https://github.com/zhangyu1818/tikka#transformDeclaration)
- [`transformLess`转换Less](https://github.com/zhangyu1818/tikka#transformLess)
- [`transformSass`转换Sass](https://github.com/zhangyu1818/tikka#transformSass)
- [`withPostcss` PostCSS](https://github.com/zhangyu1818/tikka#withPostcss)

---

## compile

执行打包。

### 参数

**cwd**

NodeJS 执行的工作目录，默认为`process.cwd()`。

**source**

需要打包的文件夹目录，默认为`src`。

**outDir**

输出文件的根目录，默认为`.`。

### 方法

**tasks(...transformer)**

打包需要的文件转换方法。

**run():Promise\<void>**

执行打包

---

## transform

执行代码文件的转换。

**test?: RegExp**

匹配文件，默认为`/\.(js|jsx|ts|tsx)$/`。

**format?: BabelFormat | Partial<Record<BabelFormat, string>>**

转换的格式，默认为`commonjs`，可以为一个对象，代表转换的格式和输出目录。

```ts
transform({
  format: {
    commonjs: 'lib',
    module: 'es',
  },
})
```

**transformOptions?: BabelBasicTransformOptions | ((format: BabelFormat, filePath: string) => BabelBasicTransformOptions)**

`babel`[配置参数](https://babeljs.io/docs/en/options)。

---

## transformDeclaration

转换`d.ts`。

**outDir?: string | string[]**

输出目录，默认为`./`。

**configFile?: string**

`tsconfig.json`文件路径。

**compilerOptions?: Record<string, any>**

`tsconfig`的`compilerOptions`属性。

---

## transformLess

转换`less`文件。

**test?: RegExp**

匹配文件，默认为`/\.less$/`

**exclude?: RegExp**

排除文件。

**outDir?: string | string[]**

输出目录，默认为`./`。

**inject?: string[]**

转换时写入内容。

**emptyOutput?: boolean**

是否输出空文件，默认为`false`。

**lessOptions?: Less.Options**

[Less.Options](https://lesscss.org/usage/#less-options)

---

## transformSass

转换`sass|scss`文件。

**test?: RegExp**

匹配文件，默认为`/\.(scss|sass)$/`。

**exclude?: RegExp**

排除文件。

**outDir?: string | string[]**

输出目录，默认为`./`。

**emptyOutput?: boolean**

是否输出空文件，默认为`false`。

**sassOptions?: sass.Options**

[sass.Options](https://sass-lang.com/documentation/js-api#options)

---

## withPostcss

写入文件前执行`postcss`。

**plugins?: AcceptedPlugin[]**

`postcss`插件。

**options?: ProcessOptions**

`postcss`配置。

**使用方式**

```js
compile({ cwd, source: 'files', outDir: 'dist' })
  .tasks(
  withPostcss(
    [
      transformLess({ outDir: 'less' }), 
      transformSass({ outDir: 'sass' }),
    ], 
    {
      plugins: [
        autoprefixer({ overrideBrowserslist: ['last 2 versions'] })
      ],
    }
  )
)
  .run()
```

