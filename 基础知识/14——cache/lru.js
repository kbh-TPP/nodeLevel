/**
 *  
 *  LRU
 *  JS 内 保存的是一个 引用  的概念
 */

/* Initialize LRU cache with default limit being 10 items */
function lru(limit) {
    this.size = 0;
    (typeof limit == "number") ? this.limit = limit: this.limit = 10;
    this.map = {};
    this.head = null;
    this.tail = null;
};


// 创建了一个节点，key value 都进行赋值
// 指针 赋值为 null
lru.prototype.lrunode = function(key, value) {
    if (typeof key != "undefined" && key !== null) {
        this.key = key;
    }
    if (typeof value != "undefined" && value !== null) {
        this.value = value;
    }
    this.prev = null; // 上一个 节点
    this.next = null; // 下一个 节点
};

// 设定头节点
// 参数是 一个 node 节点
lru.prototype.setHead = function(node) {
    node.next = this.head; // 当前节点，指向了头节点
    node.prev = null; // 前一个节点指向空

    // 如果 head = null，证明是第一个节点
    if (this.head !== null) {
        this.head.prev = node; // 当前节点的 prev 和 next 指向的都是该node
    }
    // 设定 head 指针，指向新创建的节点
    this.head = node;

    // 如果 tail 为 null，证明是首次闯进，指向当前节点
    if (this.tail === null) {
        this.tail = node;
    }

    this.size++;
    this.map[node.key] = node; // key 保存节点信息 value
}

/* Change or add a new value in the cache
 * We overwrite the entry if it already exists
 */
// 设定一个缓存的时候，看这个节点是否在缓存内，
// 如果在就覆盖，并且讲该节点设为头节点
lru.prototype.set = function(key, value) {
    // 创建一个节点
    var node = new lru.prototype.lrunode(key, value);

    // 判断是否已经在 cache 内，如果在，把这个在的节点删除。
    if (this.map[key]) {
        this.map[key].value = node.value;
        this.remove(node.key); // 删除已经存储的 key 节点

    }
    // 如果不在 cache 内，判断是否超过 cache 长度
    else {
        // 当前的 size 大于 限定值，就干掉最晚被访问的节点 
        if (this.size >= this.limit) {
            delete this.map[this.tail.key]; // 删除 最近 没有被使用的
            this.size--;
            this.tail = this.tail.prev;
            this.tail.next = null;
        }
    }

    // 将这个新创建的节点，设为头节点
    this.setHead(node);
};

/* Retrieve a single entry from the cache */
// 每次获取节点之后，就把该节点，设为头节点
lru.prototype.get = function(key) {
    if (this.map[key]) {
        var value = this.map[key].value;
        var node = new lru.prototype.lrunode(key, value);
        this.remove(key);
        this.setHead(node);
        return value;
    } else {
        console.log("Key " + key + " does not exist in the cache.")
    }
};

/* Remove a single entry from the cache */
lru.prototype.remove = function(key) {
    var node = this.map[key];
    if (node.prev !== null) {
        node.prev.next = node.next;
    } else {
        this.head = node.next;
    }
    if (node.next !== null) {
        node.next.prev = node.prev;
    } else {
        this.tail = node.prev;
    }
    delete this.map[key];
    this.size--;
};

/* Resets the entire cache - Argument limit is optional to be reset */
lru.prototype.removeAll = function(limit) {
    this.size = 0;
    this.map = {};
    this.head = null;
    this.tail = null;
    if (typeof limit == "number") {
        this.limit = limit;
    }
};

/* Traverse through the cache elements using a callback function
 * Returns args [node element, element number, cache instance] for the callback function to use
 */
lru.prototype.forEach = function(callback) {
    var node = this.head;
    var i = 0;
    while (node) {
        callback.apply(this, [node, i, this]);
        i++;
        node = node.next;
    }
}

/* Returns a JSON representation of the cache */
lru.prototype.toJSON = function() {
    var json = []
    var node = this.head;
    while (node) {
        json.push({
            key: node.key,
            value: node.value
        });
        node = node.next;
    }
    return json;
}

/* Returns a String representation of the cache */
lru.prototype.toString = function() {
    var s = '';
    var node = this.head;
    while (node) {
        s += String(node.key) + ':' + node.value;
        node = node.next;
        if (node) {
            s += '\n';
        }
    }
    return s;
}


var Lru = new lru(100);
Lru.set('hg', 'wj');
Lru.set('hg1', 'wj1');
Lru.set('hg2', 'wj2');

console.log(Lru.toJSON());
console.log(Lru.get('hg1'));
console.log(Lru.toJSON());