---
title: 블로그 어떻게 운영되나?
date: 2026-08-24
description: 블로그의 운영 스트림을 나름 정리해준다.
tags:
  - blog
  - dev
draft: false
---
## 어떻게 운영하나? 

블로그 운영에 필요한 큰 요소는 일단 두가지다. 

1. Obsidian 저장을 위한 github repo (private)
2. Blog 디플로이 및 서비스를 위한 github repo (public) 

## Obsidian 저장소 

옵시디언 지식 베이스를 저장할 수 있는 다양한 방법이 있지만 역시 github을 이용하는 게 제일 지속가능한 대안이라고 생각한다. 돈을 내고 이용하는 공식 서비스는 비용도 비용이지만, 뭔가 찜찜한 구석이 있다. 

옵시디언 저장소가 블로그 서빙과 직접적으로 연결되지는 않는다. 내 경우는 저장소의 하나의 폴더 `50-public` 만 블로그와 연결된다. 사족으로 이야기하면 이 폴더는 Obsidian -> 외부로 나가는 콘텐트를 전부 담당하고 있다. 

- `50-public > blog`: 블로그 관련 콘텐트 
- `50-public > show_lostinecon`: [SHOW of anari](https://show.lostineconomics.com) 관련 

Actions 통해서 특정 폴더의 내용이 변경되었을 때 특정 리포로 동기화를 트리거링 할 수 있기 때문에 이렇게 해두어도 작업에 큰 문제는 없다. 

## Blog Repo 

블로그 관련 Repo에는 Quartz가 설치되어 있다. Github Pages를 통해서 적적으로 서브된다. 
앞서 이야기한 옵시디언 저장소에서 `blog` 폴더가 변경되었을 경우 해당 내용이 블로그 관련 리포로 복제되고 이에 따라서 Quartz 빌드가 트리거되는 구조다. 

## Hail to Codex 

내가 생각해낸 방식이 아니고 당연히 코덱스가 제안해준 것이다. Github 설정만 몇 개 수동으로 해주면 나머지 수정 등은 코덱스가 알아서 하더라. 

![](Pasted%20image%2020260824092315.png)