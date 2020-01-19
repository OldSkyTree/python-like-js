# python-like-js
Python-подобный JavaScript

## Это javascript транслятор python-подобного языка, который поддерживает:
* циклы (for)
* условия (if, простое сравнение)
* функции (def)
* имена переменных до 7 символов
* переменные без объявления
* блоки кода через табуляцию
* комментарии

## Грамматика языка

1. <прог>           ::= <спис_опер>
2. <спис_опер>      ::= <опер>|<спис_опер>`nl`<опер>
3. <опер>           ::= <присваив>|<усл>|<функ>|<цикл>|<коммент>|<вывод>
4. <присваив>       ::= `id`<операц_присваив><выраж>
5. <операц_присваив>::= =|+=|-=|/=|*=
6. <выраж>          ::= <знач>|<знач><операц><выраж>|<скоб_выраж>|<скоб_выраж><операц><выраж>
7. <знач>           ::= `id`|`lit`
8. <операц>         ::= +|-|*|/|==|!=|>|>=|<|<=
9. <скоб_выраж>     ::= (<выраж>)
10. <усл>           ::= if <выраж>:<блок_кода>
11. <блок_кода>     ::= <опер>|`nl``indent`<спис_опер>`dedent`
12. <функ>          ::= def `id`(<спис_перем>):<блок_кода>
13. <спис_перем>    ::= ε|`id`|<спис_перем>,`id`
14. <цикл>          ::= for `id` in (<выраж>, <выраж>):<блок_кода>
15. <коммент>       ::= #`any`
16. <вывод>         ::= print(<выраж>)

### Устранение левой рекурсии

1. <прог>           ::= <спис_опер>
2. <спис_опер>      ::= <опер>|<опер><спис_опер>'
3. <спис_опер>'     ::= `nl`<опер>|`nl`<опер><спис_опер>'
4. <опер>           ::= <присваив>|<усл>|<функ>|<цикл>|<комент>|<вывод>
5. <присваив>       ::= `id`<операц_присваив><выраж>
6. <операц_присваив>::= =|+=|-=|/=|*=
7. <выраж>          ::= <знач>|<знач><операц><выраж>|<скоб_выраж>|<скоб_выраж><операц><выраж>
8. <знач>           ::= `id`|`lit`
9. <операц>         ::= +|-|*|/|==|!=|>|>=|<|<=
10. <скоб_выраж>    ::= (<выраж>)
11. <усл>           ::= if <выраж>:<блок_кода>
12. <блок_кода>     ::= <опер>|`nl``indent`<спис_опер>`dedent`
13. <функ>          ::= def `id`(<спис_перем>):<блок_кода>
14. <спис_перем>    ::= ε|`id`|`id`<спис_перем>'
15. <спис_перем>'   ::= ,`id`|,`id`<спис_перем>'
16. <цикл>          ::= for `id` in (<выраж>, <выраж>):<блок_кода>
17. <комент>        ::= #`any`
18. <вывод>         ::= print(<выраж>)

### Левая факторизация

1. <прог>               ::= <спис_опер>
2. <спис_опер>          ::= <опер><спис_опер_конец>
3. <спис_опер_конец>    ::= ε|<спис_опер>'
4. <спис_опер>'         ::= `nl`<опер><спис_опер_конец>
5. <опер>               ::= <присваив>|<усл>|<функ>|<цикл>|<комент>|<вывод>
6. <присваив>           ::= `id`<операц_присваив><выраж>
7. <операц_присваив>    ::= =|+=|-=|/=|*=
8. <выраж>              ::= <знач><выраж_конец>|<скоб_выраж><выраж_конец>
9. <выраж_конец>        ::= ε|<операц><выраж>
10. <знач>              ::= `id`|`lit`
11. <операц>            ::= +|-|*|/|==|!=|>|>=|<|<=
12. <скоб_выраж>        ::= (<выраж>)
13. <усл>               ::= if <выраж>:<блок_кода>
14. <блок_кода>         ::= <опер>|`nl``indent`<спис_опер>`dedent`
15. <функ>              ::= def `id`(<спис_перем>):<блок_кода>
16. <спис_перем>        ::= ε|`id`<спис_перем_конец>
17. <спис_перем_конец>  ::= ε|<спис_перем>'
18. <спис_перем>'       ::= ,`id`<спис_перем_конец>
19. <цикл>              ::= for `id` in (<выраж>, <выраж>):<блок_кода>
20. <комент>            ::= #`any`
21. <вывод>             ::= print(<выраж>)

### Множества FIRST и FOLLOW

Правило                 | FIRST(A)                      | FOLLOW(A)
1. <прог>               | `id`,if,def,for,print,#       | $
2. <спис_опер>          | `id`,if,def,for,print,#       | $
3. <спис_опер_конец>    | ε,`nl`                        | $
4. <спис_опер>'         | `nl`                          | $
5. <опер>               | `id`,if,def,for,print,#       | `nl`,$
6. <присваив>           | `id`                          | `nl`,$
7. <операц_присваив>    | =,+,-,/,*                     | (,`id`,`lit`
8. <выраж>              | (,`id`,`lit`                  | `nl`,$,),:,`,`
9. <выраж_конец>        | ε,+,-,*,/,=,!,>,<             | `nl`,$,),:,`,`
10. <знач>              | `id`,`lit`                    | ε,+,-,*,/,=,!,>,<,`nl`,$,),:,`,`
11. <операц>            | +,-,*,/,=,!,>,<               | `id`,`lit`
12. <скоб_выраж>        | (                             | `nl`,$,),:,`,`
13. <усл>               | if                            | `nl`,$
14. <блок_кода>         | `id`,if,def,for,print,#,`nl`  | `nl`,$
15. <функ>              | def                           | `nl`,$
16. <спис_перем>        | ε,`id`                        | )
17. <спис_перем_конец>  | ε,`,`                         | )
18. <спис_перем>'       | `,`                           | )
19. <цикл>              | for                           | `nl`,$
20. <комент>            | #                             | `nl`,$
21. <вывод>             | print                         | `nl`,$
