<template>
    <div>
        <div id="content_div">
            <div style="margin-bottom: 40px;">
                <span class="tips">被观察者(Subject)</span><span> - 主体下拉列表:</span>
                <select name="" id="per" v-model="perSelected" v-on:change="preChange()">
                    <option v-for="item in pres" :value=item.val>{{item.text}}</option>
                </select>
            </div>

            <div>
                <span class="tips">观察者1(btnObserver)</span><span> - 激活对应button:</span>
                <button v-for="item in nameBtns" class="obs_btn" v-bind:class="{'obs_btn_atc': item.isAct}">{{item.name}}</button>
            </div>

            <div>
                <span class="tips">观察者2(optionObserver)</span><span> - 显示input内容:</span>
                <select name="" id="sel1" disabled>
                    <option value="0" selected>----</option>
                    <!--<option value="1">功法</option>
                    <option value="2">法宝</option>
                    <option value="3">灵丹</option>
                    <option value="4">神兽</option>
                    <option value="5">势力</option>-->
                    <option value="6" selected>招式</option>
                </select>

                <select name="" id="sel2">
                    <option value="0"></option>
                    <option v-for="item in options" value="">{{item}}</option>
                </select>

                <input type="text" id="input1" v-model="inputVal">
            </div>

            <div>
                <span class="tips">观察者3(showObserver)</span><span> - 显示对应text:</span>
                <div id="content" v-model="contentText">{{contentText}}</div>
            </div>
        </div>
    </div>
</template>
<script>
	class Observer {
		constructor(id, fn) {
			this.id = id; // 识别标记, 用于退订(解绑)
			this.fn = fn; // 对应要执行的动作
		}

		subscribe(sub) {
			sub.subscribe(this)
		}

		execute(val) {
			this.val = val;
			this.fn(val)
		};
	}
	// 被观察者
	class Subject {
		constructor() {
			this.subTasks = []; // 当前被观察者的任务队列
		}

		subscribe(task) {
			this.subTasks.push(task); // 当前被观察者订阅
		}

		unSubscribe(task) {
			this.subTasks = this.subTasks.filter(ob => ob.id !== task.id);  // 从任务列表移除, 即退订
			//			this.subTasks.remove(task); // 当前被观察者退订
		};

		// 发布
		notify(val) {
			this.subTasks.map(item => item.fn(val))
		};
	}
	const perSubject = new Subject();
	// 订阅

	export default {
		data: function () {
            /*class Observer {
             constructor(id, fn) {
             this.id = id; // 识别标记, 用于退订(解绑)
             this.fn = fn; // 对应要执行的动作
             }

             subscribe(sub) {
             sub.subscribe(this)
             }

             execute(val) {
             this.val = val;
             this.fn(val)
             };
             }*/
			return {
				btnObserver: new Observer(1001, this.activePer),
				optionObserver: new Observer(1002, this.selSecondOptions),
				showObserver: new Observer(1003, this.showContent),
				perSelected: null,
				pres: [
					{val: 0, text: '----'},
					{val: 1, text: '司寇旗'},
					{val: 2, text: '庄叔'},
					{val: 3, text: '郁泽'},
					{val: 4, text: '罗珠'},
				],
				nameBtns: [
					{name: '司寇旗', isAct: false},
					{name: '庄叔', isAct: false},
					{name: '郁泽', isAct: false},
					{name: '罗珠', isAct: false},
				],
				options: [],
				inputVal: '',
				contentText: ''
			};
		},
		created: function() {
			perSubject.subscribe(this.btnObserver)
			perSubject.subscribe(this.optionObserver)
			perSubject.subscribe(this.showObserver)
		},
		methods: {
			preChange() {
//				console.log(this.perSelected)
				if (+this.perSelected) perSubject.notify(this.perSelected);
				this.selSecondOptions(this.perSelected);
				this.activePer(this.perSelected);
				this.showContent(this.perSelected)
			},
			selSecondOptions(value) {
				const val = value;
				const valType = {
					1: ['雀羽虎尾禁轴', '落花赤炎灵诀', '飞狼本无奇书', '玄光重生秘抄'],
					2: ['七圣今珠戟', '红炎佛星伞', '造化名尘铲', '如来粗火锥'],
					3: ['原始破障圣丹', '天妖培婴禁丹', '太始忘尘金丹', '五行祛邪回丹'],
					4: ['绝代绿震龙', '夺命圣蕊驹', '绣金靛毁雁', '龙鳞绿秀凤'],
					5: ['玄阴剑派', '天网教', '斩日峰', '地藏舫']
				};
				const tricks = [
					'般若爪', '真火龙腿', '摧魂咒', '狂龙破', '玄炎闪', '还神佛杀', '千里步', '鬼神爪', '无极魔劲',
					'紫霜皇掌', '巨鲨佛劈', '千虫吟', '护体佛劈', '莲妖指', '断岳手', '赤炎剑', '狂涛掌', '飘雪闪',
					'杀妖拳', '寰宇步', '哭魂吟', '摧日佛舞', '六爻变', '圣天霸破', '四方变', '灵龙佛咒', '紫霞咒',
					'鱼龙瘴', '先天圣雷', '赤日斧', '飞星雷', '蟠龙魔封', '蟠龙佛劲', '吹雪拳', '血焰枪', '圆通咒',
					'金刚龙指', '精铜皇劲', '绿玉神闪', '万雷闪', '菩提魔劈', '妖魔指', '清静解', '日扬龙隐', '兽皇爆', '龙凰劲',
					'一炬佛手', '地缚掌', '雷风变', '琼浆吟', '玄龟雷', '金仙枪', '龙胆咒', '白虎法', '映月霸腿'
				];

				let num = Math.random().toFixed(4);
				let tArr = [null, null];
//				console.log(num);
//				console.log(tArr);
//				let html = '';
				tArr.some((item, idx) => {
					let random = Math.random() * (55 - 0);
//					console.log(random.toFixed(0))
					tArr[idx] = tricks[random.toFixed(0)]
//					html += `<option value="${val}${idx}">${tricks[random.toFixed(0)]}</option>`
					this.options.push(tricks[random.toFixed(0)])
				});


//				sel2.innerHTML = html;
				this.inputVal = tArr.join(', ');

				this.submit(value)

			},
			submit(value) {
				this.contentText = `${value} has ${this.options[this.perSelected]} <br/>`
			},
			activePer(idx) {
				this.nameBtns.map(item => {
					item.isAct = false;
				});
				this.nameBtns[idx - 1].isAct = true
			},

			createEq(idx) {
//				console.log(idx)
				const eqs = [
					['功法', '雀羽虎尾禁轴', '落花赤炎灵诀', '飞狼本无奇书', '玄光重生秘抄'],
					['法宝', '七圣今珠戟', '红炎佛星伞', '造化名尘铲', '如来粗火锥'],
					['灵丹', '原始破障圣丹', '天妖培婴禁丹', '太始忘尘金丹', '五行祛邪回丹'],
					['神兽', '绝代绿震龙', '夺命圣蕊驹', '绣金靛毁雁', '龙鳞绿秀凤'],
					['势力', '玄阴剑派', '天网教', '斩日峰', '地藏舫']
				]

				let eq = '';
				eqs.map(item => {
					eq += `<br>${item[0]}: ${item[idx]}`;
				})

				return eq;
			},
			createContent() {
				const c = [
					'中有万鬼群，微摆撼天柱',
					'风府通天，左右辘轳转',
					'鬼道相连，鼓漱三十六',
					'体入自然，日月失昏',
					'气游关元，四时失度',
					'度者几人，凡有此灾',
					'引体真气，如此三度毕',
					'身度我界，叩齿三十六',
					'梵行诸天，四时失度',
					'斩馘六鬼锋，至圣神人'
				];
//				console.log(Math.random().toFixed(1) * 10)
				return c[(Math.random() * (10 - 0)).toFixed(0)];

			},
			showContent() {
				let eq = this.createEq(this.perSelected)
				let c = this.createContent(this.perSelected)
				content.innerHTML = `${eq}<br> 他念道；  ${c}`;
			}
		}
	}
</script>
<style scoped>
    .obs_btn {
        border: 1px solid #f2f2f2;
        width: 60px;
        height: 30px;
        background: #f2f2f2;
        margin: 10px;
    }

    .obs_btn_atc {
        border: 1px solid lightblue;
        background: lightblue;
    }

    #ct {
        display: none;
    }

    #content_div, #content_div div {
        margin: 0 auto;
        /*text-align: center;*/
    }

    .tips {
        margin: 10px;
        display: inline-block;
        /*width: 650px;*/
        text-align: right;
        color: #ff6700;
    }

    #per {
        padding: 5px;
        margin: auto 10px;
        width: 15%;
    }

    #content {
        display: inline-block;
        vertical-align: top;
    }

    #sel2 {
        display: none;
    }
</style>
