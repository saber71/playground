**Synchronized 与 ReentrantLock 的深层对比**

* 除了基本用法，它们在底层实现（对象头标记 vs AQS队列）、锁升级过程（偏向锁->
  轻量级锁->重量级锁）、以及等待/通知机制（Object.wait/notify vs
  Condition）上有什么本质区别？

Synchronized：由jvm实现，每个对象头中都会有几个专门的bit位用于存储锁标志。
会通过修改对象头的标志位来获取锁，如果失败则进入锁升级流程或阻塞
在升级位重量级锁时，未获取到锁的线程会被放入ObjectMonitor等待队列中，操作系统内核会阻塞或唤醒线程
加锁/解锁有专门的字节码指令，jvm会自动在代码前后插入字节码指令

ReentrantLock：由java代码（AQS）实现，AQS会维护一个volatile整数state表示同步状态。
AQS内部还有一个队列，获取锁失败的线程会进入队列尾部，通过自旋+LockSupport.park()挂起
需要手动调用lock和unlock方法加锁和解锁。获取锁的方式是尝试修改state值，如果成功修改则当前线程持有锁，失败则进入队列挂起

* 在什么场景下你会优先选择 `ReentrantLock` 而不是 `synchronized`
  ？请结合公平锁和非公平锁的实现原理说明。