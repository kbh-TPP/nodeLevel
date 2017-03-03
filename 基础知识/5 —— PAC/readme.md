###
    
      PAC ——  文件在staff-wifi  中没有，在Office-wifi 有用，如果没有pac设置，office-wifi 无法访问百度。
      PAC文件格式
     
      PAC的作用 ——  网络代理实现智能流量分流的研究(PAC脚本介绍及利用)
      
      PAC文件是纯文本格式的，实际上就是JavaScript文件。Chrome/Chromium的扩展Switchy!的"Auto Switch Mode"功能实际上也是创建和维护一个简单的PAC文件，但功能比较弱。对于一般的应用，即使你几乎不懂JavaScript和编程，也可以通过本文的介绍实现基本的功能。
      
      1、什么是代理脚本(PAC)
      一个PAC文件其实就是一个文本文件，最简单的格式就是包含一个叫FindProxyForURL的JScript函数，IE通过传入两个变量来调用这个函数，一个是用户浏览的地址URL全路经，一个是这个URL中的主机名部分(host)。这个FindProxyForURL函数有三种可能的字符串。返回值，
      一是"DIRECT"，就是直接连接，不通过代理；
      二是"PROXY proxyaddr:port"，其中proxyaddr和port分别是代理的地址和代理的端口；
      三是"SOCKS socksaddr:port"，其中socksaddr和port分别是socks代理的地址和端口，【只支持 TCP 和 UDP】
      一个自动代理文件可以是多个选择的组合，其中用分号(;)隔开。
      【注意SOCKS4与SOCKS5；区分是SOCKS5，TCP 和 UDP都支持】