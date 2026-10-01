---
title: Google AppSrcipt 배포 자동화
date: 2026-10-01
description: gas와 github의 연동
tags:
  - blog
  - dev
draft: false
---
앞서 개인 데이터의 출처로는 구글 스프레드시트만한 것이 없다고 이야기 한 바 있다. 그런데 이 녀석을 잘 쓰기 위해서는 gas를 종종 써야 한다. 

물론 gas의 개발도 AI가 한다. 다만 gas의 스크립트를 배포하는 과정을 자동화할 수 없을까, 하는 고민이 있다. 즉, 복붙하고 싶지 않다는 이야기다. Codex는 세가지 정도의 대안을 알려 주었는데, 가장 편리한 것이 clasp를 github actions를 활용해 써먹는 것이다. 

[clasp](https://github.com/google/CLASP)는 Command Line Apps Script Projects의 약자로 구글의 공식 앱이다. CLI를 통해서 앱스크립트를 작성, 관리, 배포할 수 있게 해준다. 로컬과 연동해도 되지만 어차피 실행에는 많은 품이 들지 않으니 Github Actions에 깔아서 활용해도 된다. 공식 앱이니 만큼 크리덴셜 문제도 없다. 

github 로컬 폴더를 인공지능에 물려 놓고 `.gs` 파일들을 개발한다. 그리고 푸시하면 끝이다.  