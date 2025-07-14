# 技术问题汇总

## 一、基础概念 (Foundational Concepts)

1.  **React 的核心价值**: 为什么我们需要像 React.js 这样的库？直接通过 JavaScript 操作 DOM 有什么缺点？
2.  **函数式组件**: 为什么现代 React 开发推荐使用函数式组件？
3.  **组件生命周期与 Hooks**:
    - 函数式组件有生命周期的概念吗？如何通过 Hooks (如 `useEffect`) 来模拟？
    - `useState`, `useEffect`, 和 `useCallback` 的核心区别和各自的使用场景是什么？
    - 在函数式组件中，每次渲染时内部声明的函数都会被重新创建吗？`useCallback` 如何解决由此可能引发的性能问题？

## 二、Next.js 与 App Router

1.  **路由架构**: 本项目使用的 App Router 与传统的 Pages Router 相比，核心区别是什么？
2.  **组件模型**:
    - Next.js 中的服务器组件 (Server Components) 和客户端组件 (Client Components) 有什么不同？
    - `StockSearch.tsx` 和 `FinancialStatement.tsx` 应分别设计为哪种组件？为什么？
3.  **数据获取**:
    - 在 App Router 中，推荐的数据获取策略是怎样的？它与在 `useEffect` 中 `fetch` 数据相比有何优势？
4.  **路由机制**:
    - Next.js 的文件系统路由是如何工作的？
    - 如何实现动态路由，例如创建一个 `/stock/[stockId]` 页面？
5.  **渲染策略**:
    - 解释一下 SSR (服务端渲染), SSG (静态网站生成), 和 ISR (增量静态再生)。
    - 对于这个财务报表项目，哪种渲染策略最为合适？

## 三、TypeScript 应用

1.  **类型定义**:
    - 如何为从 FinMind API 获取的数据（例如 `TaiwanStockMonthRevenue`）创建 TypeScript 类型或接口？这样做的好处是什么？
    - 如何为 React 组件的 props (例如 `FinancialStatement` 的 `stockId`) 定义类型？
2.  **泛型 (Generics)**: 在什么场景下可以在 React 和 TypeScript 项目中使用泛型？（例如：封装一个可复用的数据获取 Hook）。

## 四、数据处理与状态管理

1.  **UI 状态处理**: 在请求 API 数据时，如何优雅地管理和展示“加载中”(Loading) 和“请求失败”(Error) 的 UI 状态？
2.  **数据缓存**: 当用户重复查询同一支股票时，你会采用什么策略来缓存数据，以避免不必要的 API 请求？
3.  **状态管理方案**:
    - 什么情况下 `useState` 不足以满足项目的状态管理需求？
    - 你了解哪些全局状态管理方案（如 React Context, Zustand, Redux）？它们分别适用于什么场景？

## 五、UI 与样式 (MUI)

1.  **布局组件**: MUI 中的 `Box` 和 `Container` 组件有什么区别和用途？
2.  **样式化方案**: MUI 提供了多种自定义组件样式的方式（如 `sx` prop, `styled()` API），它们各有什么优缺点？
3.  **主题定制 (Theming)**: 如何使用 MUI 的主题功能来统一应用的颜色、字体和间距，以实现统一的品牌视觉？
