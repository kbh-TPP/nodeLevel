

bash 学习笔记

### 我这里主要描述的是 shell bash，就用过这个。

	我们关注的重点是Bash，也就是Bourne Again shell，由于易用和免费，Bash在日常工作中被广泛使用。

    touch text.sh

    ```bash

        echo "hello world"
    
    ```

    chmod +x text.sh


	```bash

        echo "What is your name?"
        
        read PERSON
        
        echo "Hello, $PERSON"
    ```


### shell 变量
	
	定义变量
	variableName="fuck"

	使用变量
	echo $variableName


	变量可以被重新被定义，

	只读变量 readonly

	删除变量 unset


### 变量类型

	1) 局部变量

		局部变量在脚本或命令中定义，仅在当前shell实例中有效，其他shell启动的程序不能访问局部变量。
	2) 环境变量

		所有的程序，包括shell启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。必要的时候shell脚本也可以定义环境变量。
	3) shell变量

		shell变量是由shell程序设置的特殊变量。shell变量中有一部分是环境变量，有一部分是局部变量，这些变量保证了shell的正常运行



### 特殊变量
	
	$echo $$


				特殊变量列表
	变量	含义
	$0	当前脚本的文件名
	$n	传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是$1，第二个参数是$2。
	$#	传递给脚本或函数的参数个数。
	$*	传递给脚本或函数的所有参数。
	$@	传递给脚本或函数的所有参数。被双引号(" ")包含时，与 $* 稍有不同，下面将会讲到。
	$?	上个命令的退出状态，或函数的返回值。
	$$	当前Shell进程ID。对于 Shell 脚本，就是这些脚本所在的进程ID。


	退出状态
		$? 可以获取上一个命令的退出状态。所谓退出状态，就是上一个命令执行后的返回结果。
		退出状态是一个数字，一般情况下，大部分命令执行成功会返回 0，失败返回 1。
		不过，也有一些命令返回其他值，表示不同类型的错误。



###	Shell 变量替换，命令替换，转义字符
	
	a=10
	echo -e "Value of a is $a \n"


	下面的转义字符都可以用在 echo 中：
		转义字符	含义
		\\	反斜杠
		\a	警报，响铃
		\b	退格（删除键）
		\f	换页(FF)，将当前位置移到下页开头
		\n	换行
		\r	回车
		\t	水平制表符（tab键） 
		\v	垂直制表符


#### 命令替换

	命令替换是指Shell可以先执行命令，将输出结果暂时保存，在适当的地方输出。

		命令替换的语法：
			`command`
		注意是反引号，不是单引号，这个键位于 Esc 键下方。




#### 变量替换
	
	变量替换可以根据变量的状态（是否为空、是否定义等）来改变它的值
	形式					说明
	${var}			变量本来的值
	
	${var:-word}	如果变量 var 为空或已被删除(unset)，那么返回 word，但不改变 var 的值。
	
	${var:=word}	如果变量 var 为空或已被删除(unset)，那么返回 word，并将 var 的值设置为 word。

	${var:?message}	如果变量 var 为空或已被删除(unset)，那么将消息 message 送到标准错误输出，可以用来检测变量 var 是否可以被正常赋值。若此替换出现在Shell脚本中，那么脚本将停止运行。

	${var:+word}	如果变量 var 被定义，那么返回 word，但不改变 var 的值。




### Shell运算符

	使用 awk、expr 进行操作，awk比较常用。

#### 
	
	val=`expr 2 + 2`
	echo "Total value : $val"

	两点注意：
		表达式和运算符之间要有空格，例如 2+2 是不对的，必须写成 2 + 2，这与我们熟悉的大多数编程语言不一样。完整的表达式要被 ` ` 包含，注意这个字符不是常用的单引号，在 Esc 键下边。


	注意：
		乘号(*)前边必须加反斜杠(\)才能实现乘法运算；
		if...then...fi 是条件语句，后续将会讲解。


		if [ $a == $b ]
		then
		   echo "a is equal to b"
		fi

		if [ $a != $b ]
		then
		   echo "a is not equal to b"
		fi



					算术运算符列表
	运算符	说明			举例
	+		加法			`expr $a + $b` 结果为 30。
	-		减法			`expr $a - $b` 结果为 10。
	*		乘法			`expr $a \* $b` 结果为  200。
	/		除法			`expr $b / $a` 结果为 2。
	%		取余			`expr $b % $a` 结果为 0。
	=		赋值			a=$b 将把变量 b 的值赋给 a。
	==		相等。		用于比较两个数字，相同则返回 true。	[ $a == $b ] 返回 false。
	!=		不相等。		用于比较两个数字，不相同则返回 true。	[ $a != $b ] 返回 true。


						关系运算符列表
	运算符	说明	举例
	-eq		检测两个数是否相等，相等返回 true。					[ $a -eq $b ] 返回 true。
	-ne		检测两个数是否相等，不相等返回 true。					[ $a -ne $b ] 返回 true。
	-gt		检测左边的数是否大于右边的，如果是，则返回 true。		[ $a -gt $b ] 返回 false。
	-lt		检测左边的数是否小于右边的，如果是，则返回 true。		[ $a -lt $b ] 返回 true。
	-ge		检测左边的数是否大等于右边的，如果是，则返回 true。		[ $a -ge $b ] 返回 false。
	-le		检测左边的数是否小于等于右边的，如果是，则返回 true。		[ $a -le $b ] 返回 true。





						布尔运算符列表
	运算符		说明											举例
	!	非运算，表达式为 true 则返回 false，否则返回 true。	[ ! false ] 返回 true。
	-o	或运算，有一个表达式为 true 则返回 true。		[ $a -lt 20 -o $b -gt 100 ] 返回 true。
	-a	与运算，两个表达式都为 true 才返回 true。		[ $a -lt 20 -a $b -gt 100 ] 返回 false。

















