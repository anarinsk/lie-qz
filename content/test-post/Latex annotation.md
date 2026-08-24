---
title: 수식은 잘 나오냐?
date: 2026-08-22
description: TeX 수식 표기 확인
tags:
  - latex
  - math
draft: false
---

## 테스트 결과 
- Computer Modern 역시 좋은 것 같다. 
- 더 좋은 폰트를 찾으면 바꾸자. 
- 테스트해본 폰트 
	- ~~Computer Modern~~: 정통 $\rm \LaTeX$ 스타일. 살짝 심심 
	- ~~Google Sans Math~~: 뭔가 투박하다. 
	- __STIX Two Math__: 현재 채택된 폰트, 깔끔하다.  

## 1. 인라인 수식 (Inline Math)
* 질량-에너지 등가 원리: $E = mc^2$
* 오일러의 등식: $e^{i\pi} + 1 = 0$
* 정규분포 확률밀도함수 변수: $X \sim \mathcal{N}(\mu, \sigma^2)$

---

## 2. 블록 수식 (Display Math)

### 근의 공식 (Fractions & Square Root)

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

### 미적분 및 가우스 적분 (Integrals & Limits)

$$\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}$$

$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

### 급수 및 테일러 전개 (Summation & Series)

- 두가지 다른 타입의 블록 수식? 
	- 옵시디언 상에서는 차이가 없다. 
	- 웹으로 렌더링된 상태는 다를까? 

$$e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots$$

$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots
$$

### 행렬 연산 (Matrices)

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}^{-1} = \frac{1}{ad - bc} \begin{bmatrix}
d & -b \\
-c & a
\end{bmatrix}
$$

### 조건부 함수 (Piecewise / Cases)

$$
f(x) = \begin{cases} 
\frac{1}{x} & \text{if } x \neq 0 \\ 
0 & \text{if } x = 0 
\end{cases}
$$

### 맥스웰 방정식 (Differential Forms / Vector Calculus)

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}, \quad \nabla \times \mathbf{B} = \mu_0 \left( \mathbf{J} + \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t} \right)
$$


