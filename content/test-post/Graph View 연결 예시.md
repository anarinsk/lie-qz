---
title: "Graph View 연결 예시"
date: 2026-08-22
description: "Quartz Graph View에서 문서 간 연결이 어떻게 보이는지 확인하는 예시 글"
tags:
  - test
  - graph
  - obsidian
draft: false
---

# Graph View 연결 예시

이 문서는 Quartz Graph View에서 문서 간 연결이 어떻게 표시되는지 확인하기 위한 예시입니다.

## 연결된 문서

아래 위키 링크들은 Graph View에서 이 문서와 다른 문서 사이의 연결선으로 표시됩니다.

- [[표준 Markdown 예시]]
- [[백링크 활용 예시]]
- [[테스트]]
- [[중간 테스트]]

표시 이름을 바꿔도 연결 대상은 유지됩니다.

- [[표준 Markdown 예시|Markdown 문서 포맷 예시]]
- [[백링크 활용 예시|Backlink 사용 예시]]

## Graph View에서 확인할 점

이 글을 발행한 뒤 Graph View를 열면 다음 연결을 확인할 수 있습니다.

1. `Graph View 연결 예시` 노드가 생성됩니다.
2. 이 문서에서 링크한 기존 문서들과 선으로 연결됩니다.
3. `graph`, `test`, `obsidian` 태그 노드가 표시됩니다.
4. `표준 Markdown 예시` 페이지의 Backlinks 영역에도 이 문서가 표시됩니다.

## 연결을 늘리는 방법

Graph View는 문서 안의 링크와 태그를 바탕으로 만들어집니다. 글을 작성할 때 다음 기준을 적용하면 시간이 지날수록 연결 구조가 좋아집니다.

- 관련 글은 본문에서 직접 위키 링크로 연결합니다.
- 반복해서 쓰는 개념은 별도 문서로 만들고 여러 글에서 링크합니다.
- 태그는 큰 주제 분류에만 사용합니다.
- 문서 제목은 나중에 Graph View에서 봐도 의미가 분명하게 작성합니다.

## 테스트용 추가 연결

아래 링크는 아직 존재하지 않는 문서입니다. Obsidian과 Quartz에서는 이런 링크도 나중에 문서를 만들 때 자연스럽게 연결할 수 있습니다.

- [[Graph View]]
- [[Digital Garden]]
- [[문서 연결 전략]]
