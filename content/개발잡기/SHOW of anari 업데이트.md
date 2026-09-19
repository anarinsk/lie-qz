---
title: SHOW of anari 업데이트
date: 2026-09-19
description: 영화 목록 업데이트
tags:
  - blog
  - dev
draft: false
---
[SHOW of anari](https://show.lostineconomics.com/) 사이트를 업데이트했다. 기존 디자인이 좀 요란하기도 했고, 내심 codex가 얼마나 잘 하는지 보고 싶었다. 

참 모든 게 너무 간단하더라. 바이브 코딩의 시대다. 

## 서비스 플로우 

1. 이 사이트는 기본적으로 github pages를 통해 서비스된다. 즉, static web이라는 뜻이다. 
2. 리뷰는 개인 obsidian 저장소에서 업데이트한다. 내용이 업데이트되면 github actions를 통해서 해당 내용이 사이트 저장소로 동기화된다. 
3. 제일 난감했던 대목이 imdb watchlist 업데이트. 개인 사용자에게 별도의 api를 제공하지 않기 때문에 목록을 업데이트하려면 csv를 다운받아서 업데이트해야 한다. codex 내에서 워크플로우를 통해서 완성했다. 필요할 때 실행하면 된다. 