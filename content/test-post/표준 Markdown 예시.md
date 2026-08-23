---
title: "표준 Markdown 예시"
date: 2026-08-22
description: "Quartz 블로그 발행을 점검하기 위한 표준 Markdown 문서 예시"
tags:
  - test
  - markdown
draft: false
---

# 표준 Markdown 예시

이 문서는 `50-Public/blog`에서 Quartz로 발행되는 글의 기본 형식을 점검하기 위한 예시입니다. Obsidian 전용 문법보다는 일반 Markdown 문법을 우선 사용합니다.

## 문단

문단은 빈 줄로 구분합니다. 한 문단 안에서는 줄바꿈을 과하게 쓰지 않고, 의미 단위가 바뀔 때 새 문단을 만듭니다.

강조는 **굵게**, *기울임*, `인라인 코드`처럼 작성합니다.

## 목록

순서 없는 목록:

- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

순서 있는 목록:

1. 문제를 정의합니다.
2. 필요한 자료를 모읍니다.
3. 결론을 짧게 정리합니다.

## 링크

외부 링크는 표준 Markdown 링크를 사용합니다.

[Quartz 공식 문서](https://quartz.jzhao.xyz/)

내부 문서 링크도 가능하면 공개 URL 구조를 고려해 작성합니다.

[Hello, World!](Hello,%20World!.md)

## 인용

> 좋은 공개 글은 나중에 다시 읽어도 맥락을 복원할 수 있어야 합니다.

## 표

| 항목 | 권장값 | 비고 |
| --- | --- | --- |
| 제목 | `title` | frontmatter에 작성 |
| 발행일 | `date` | `YYYY-MM-DD` 형식 |
| 태그 | `tags` | 검색과 분류에 사용 |
| 초안 | `draft` | 공개 전에는 `true` |

## 코드 블록

```bash
cd /Users/anari/GitHub/personal
git status
```

```js
const title = "표준 Markdown 예시";
console.log(title);
```

## 체크리스트

- [x] frontmatter 작성
- [x] 제목 작성
- [x] 본문 구조 확인
- [ ] 발행 후 화면 확인

## 마무리

이 파일이 정상적으로 보이면 Markdown 파싱, 코드 폰트, 표, 체크리스트, 링크 스타일을 한 번에 확인할 수 있습니다.
