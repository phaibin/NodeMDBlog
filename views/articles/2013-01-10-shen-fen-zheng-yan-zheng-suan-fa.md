---
layout: post
title: 身份证验证算法
date: 2013-01-10 10:23
categories:
- 算法
tags: []
published: true
comments: true
---
参考：<http://fanlb.blogbus.com/logs/220951216.html>

1. 号码的结构     
    公民身份号码是特征组合码，由十七位数字本体码和一位校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数 字校验码。

2. 地址码       
    表示编码对象常住户口所在县(市、旗、区)的行政区划代码，按GB/T2260的规定执行。

3. 出生日期码  
    表示编码对象出生的年、月、日，按GB/T7408的规定执行，年、月、日代码之间不用分隔符。

4. 顺序码  
    表示在同一地址码所标识的区域范围内，对同年、同月、同日出生的人编定的顺序号，顺序码的奇数分配给男性，偶数分配给女性。

5. 校验码  
    1). 十七位数字本体码加权求和公式S = Sum(Ai * Wi), i = 1 ... , 17 ，先对前17位数字的权求和Ai:表 示第i位置上的身份证号码数字值Wi:表示第i位置上的加权因子  
        Wi: 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2

    2). 计算模Y = mod(S, 11)

    3). 通过模得到对应的校验码  
        Y:      0 1 2 3 4 5 6 7 8 9 10  
        校验码: 1 0 X 9 8 7 6 5 4 3 2


不过这个算法不会验证年月日在逻辑上的有效性，比如月可以超过12，日可以超过31。如果要追求完备需要单独验证一下这些字段。
