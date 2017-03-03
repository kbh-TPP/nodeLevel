

#!/bin/sh

#print hello world in the console window

# a="hello world"	# 这里注意不要加空格 a = 'hello world' 是错误的。

# # echo $a

# echo env

# set a=10

## ----------------------------------

# echo "What is your name?"
# read PERSON
# echo "Hello, $PERSON"

## ----------------------------------

# echo $$


## ----------------------------------


#variableName="fuck"

#echo $variableName


## ---------------------------------

# for skill in Ada Coffe Action Java 
# do
#     echo "I am good at ${skill}Script"
# done

## ---------------------------------

# echo "File Name: $0"
# echo "First Parameter : $1"
# echo "First Parameter : $2"
# echo "Quoted Values: $@"
# echo "Quoted Values: $*"
# echo "Total Number of Parameters : $#"

## ---------------------------------


#!/bin/bash
# a=10
# echo -e "Value of a is $a \n"

## ---------------------------------

# 命令替换
#!/bin/bash
# DATE=`date`
# echo "Date is $DATE"
# USERS=`who | wc -l`
# echo "Logged in user are $USERS"
# UP=`date ; uptime`
# echo "Uptime is $UP"


## ---------------------------------

# 命令替换

# word="Variable is not set"

# # :- var存在，就返回var，不存在，或者删除，就使用word，
# # 但是，不改变var的值 —— no change!

# echo ${var:-${word}}
# echo "1 - Value of var is ${var}"
# echo

# # :- var存在，就返回var，不存在，或者删除，就使用word，
# # 但是，改变var的值 —— yes！change

# echo ${var:=${word}}
# echo "2 - Value of var is ${var}"
# echo


# # 由于已经定义了，所以要删除
# unset var


# # 由于这里，没有定义var，因此，就返回空，只有当var定义的时候，才会输出后面的。
# echo ${var:+"This is default value"}
# echo "3 - Value of var is $var"
# echo


# word="This is default value"

# # 定义了var，因此返回word
# var="Prefix"
# echo ${var:+${word}}
# echo "4 - Value of var is $var"
# echo



# echo ${var:?"Print this message"}
# echo "5 - Value of var is ${var}"


## ---------------------------------

# val=`expr 2 + 2`
# echo "Total value : $val"

## ---------------------------------



#!/bin/sh
# a=10
# b=20

# val=`expr $a + $b`
# echo "a + b : $val"

# val=`expr $a - $b`
# echo "a - b : $val"

# val=`expr $a \* $b`
# echo "a * b : $val"

# val=`expr $b / $a`
# echo "b / a : $val"

# val=`expr $b % $a`
# echo "b % a : $val"

# if [ $a == $b ]
# then
#    echo "a is equal to b"
# fi

# if [ $a != $b ]
# then
#    echo "a is not equal to b"
# fi


## ---------------------------------


#!/bin/sh
a=10
b=20
if [ $a != $b ]
then
   echo "$a != $b : a is not equal to b"
else
   echo "$a != $b: a is equal to b"
fi
if [ $a -lt 100 -a $b -gt 15 ]
then
   echo "$a -lt 100 -a $b -gt 15 : returns true"
else
   echo "$a -lt 100 -a $b -gt 15 : returns false"
fi
if [ $a -lt 100 -o $b -gt 100 ]
then
   echo "$a -lt 100 -o $b -gt 100 : returns true"
else
   echo "$a -lt 100 -o $b -gt 100 : returns false"
fi
if [ $a -lt 5 -o $b -gt 100 ]
then
   echo "$a -lt 100 -o $b -gt 100 : returns true"
else
   echo "$a -lt 100 -o $b -gt 100 : returns false"
fi










