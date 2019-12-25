# python-like-js
Python-like JavaScript

## This is javascript translator of a python-like language that supports:
* cycles (for, while)
* conditions (if-else)
* variables without declaration
* code blocks
* comments
### API

#### Остановка очереди
POST `/api/v2/queue/disable`

##### Параметры
`queueId` --- id очереди
`services` --- список сервисов
Если сервисы не переданы, то останавливается вся очередь

##### Пример
`/api/v2/queue/disable?queueId=si/frontend&services=a&services=b`
Блокирует сервисы `a` и `b` очереди `si/frontend`

#### Запуск очереди
POST `/api/v2/queue/enable`

##### Параметры
`queueId` --- id очереди
`services` --- список сервисов
Если сервисы не переданы, то запускается вся очередь

##### Пример
`/api/v2/queue/enable?queueId=si/frontend&services=a`
Запускает сервис `a` очереди `si/frontend`
