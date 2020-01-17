# python-like-js
Python-like JavaScript

## This is javascript translator of a python-like language that supports:
* cycles (for, while)
* conditions (if-else)
* variables without declaration
* code blocks
* comments

## Grammar of language

1. <прог>           ::= <спис_опер>
2. <спис_опер>      ::= <опер>|<спис_опер>`newline`<опер>
3. <опер>           ::= <присваив>|<усл>|<функ>|<цикл>|<комент>|<вывод>
4. <присваив>       ::= `id`=<выраж>
5. <усл>            ::= if <усл_выраж>:<блок_кода>
6. <блок_кода>      ::= <опер>|`newline``indent`<спис_опер>`dedent`
7. <функ>           ::= def `id`(<спис_перем>):<блок_кода>
8. <спис_перем>     ::= `id`|<спис_перем>,`id`
9. <цикл>           ::= for `id` in (`lit`, `lit`):<блок_кода>
10. <комент>        ::= #`any`
11. <вывод>         ::= print(`id`|`lit`)
