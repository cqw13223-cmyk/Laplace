// ラプラス変換の計算エンジン

const functionDefinitions = {
    constant: {
        name: 'f(t) = c',
        parameters: ['c'],
        formula: (c) => `F(s) = \\frac{${c}}{s}`,
        condition: 's > 0'
    },
    unit_step: {
        name: 'f(t) = u(t)',
        parameters: [],
        formula: () => 'F(s) = \\frac{1}{s}',
        condition: 's > 0'
    },
    ramp: {
        name: 'f(t) = t',
        parameters: [],
        formula: () => 'F(s) = \\frac{1}{s^2}',
        condition: 's > 0'
    },
    t_squared: {
        name: 'f(t) = t^2',
        parameters: [],
        formula: () => 'F(s) = \\frac{2}{s^3}',
        condition: 's > 0'
    },
    exponential: {
        name: 'f(t) = e^{at}',
        parameters: ['a'],
        formula: (a) => `F(s) = \\frac{1}{s - (${a})}`,
        condition: (a) => `s > ${a}`
    },
    t_exponential: {
        name: 'f(t) = t \\cdot e^{at}',
        parameters: ['a'],
        formula: (a) => `F(s) = \\frac{1}{(s - (${a}))^2}`,
        condition: (a) => `s > ${a}`
    },
    sine: {
        name: 'f(t) = \\sin(\\omega t)',
        parameters: ['ω'],
        formula: (omega) => `F(s) = \\frac{${omega}}{s^2 + (${omega})^2}`,
        condition: 's > 0'
    },
    cosine: {
        name: 'f(t) = \\cos(\\omega t)',
        parameters: ['ω'],
        formula: (omega) => `F(s) = \\frac{s}{s^2 + (${omega})^2}`,
        condition: 's > 0'
    },
    exp_sine: {
        name: 'f(t) = e^{at} \\sin(\\omega t)',
        parameters: ['a', 'ω'],
        formula: (a, omega) => `F(s) = \\frac{${omega}}{(s - (${a}))^2 + (${omega})^2}`,
        condition: (a) => `s > ${a}`
    },
    exp_cosine: {
        name: 'f(t) = e^{at} \\cos(\\omega t)',
        parameters: ['a', 'ω'],
        formula: (a, omega) => `F(s) = \\frac{s - (${a})}{(s - (${a}))^2 + (${omega})^2}`,
        condition: (a) => `s > ${a}`
    },
    sinh: {
        name: 'f(t) = \\sinh(at)',
        parameters: ['a'],
        formula: (a) => `F(s) = \\frac{${a}}{s^2 - (${a})^2}`,
        condition: (a) => `s > |${a}|`
    },
    cosh: {
        name: 'f(t) = \\cosh(at)',
        parameters: ['a'],
        formula: (a) => `F(s) = \\frac{s}{s^2 - (${a})^2}`,
        condition: (a) => `s > |${a}|`
    }
};

// 関数選択時のイベントリスナー
document.getElementById('function-select').addEventListener('change', function() {
    const selectedFunc = this.value;
    updateParameterInputs(selectedFunc);
});

// パラメータ入力フィールドの更新
function updateParameterInputs(funcType) {
    // すべてのパラメータを非表示にする
    document.getElementById('param-c').style.display = 'none';
    document.getElementById('param-a').style.display = 'none';
    document.getElementById('param-omega').style.display = 'none';

    if (!funcType || !functionDefinitions[funcType]) {
        return;
    }

    const funcDef = functionDefinitions[funcType];
    
    // 必要なパラメータを表示
    if (funcDef.parameters.includes('c')) {
        document.getElementById('param-c').style.display = 'block';
    }
    if (funcDef.parameters.includes('a')) {
        document.getElementById('param-a').style.display = 'block';
    }
    if (funcDef.parameters.includes('ω')) {
        document.getElementById('param-omega').style.display = 'block';
    }
}

// ラプラス変換の計算
function calculateTransform() {
    const selectedFunc = document.getElementById('function-select').value;

    if (!selectedFunc || !functionDefinitions[selectedFunc]) {
        alert('関数を選択してください');
        return;
    }

    const funcDef = functionDefinitions[selectedFunc];
    
    // パラメータを取得
    const params = {};
    if (funcDef.parameters.includes('c')) {
        params.c = parseFloat(document.getElementById('constant-value').value);
    }
    if (funcDef.parameters.includes('a')) {
        params.a = parseFloat(document.getElementById('param-a-value').value);
    }
    if (funcDef.parameters.includes('ω')) {
        params.omega = parseFloat(document.getElementById('param-omega-value').value);
    }

    // 計算結果を生成
    const inputFormula = '$$' + funcDef.name + '$$';
    const paramValues = Object.values(params);
    const outputFormula = '$$' + funcDef.formula(...paramValues) + '$$';
    const condition = '$$' + (typeof funcDef.condition === 'function' 
        ? funcDef.condition(...paramValues) 
        : funcDef.condition) + '$$';

    // 結果を表示
    document.getElementById('input-formula').innerHTML = inputFormula;
    document.getElementById('output-formula').innerHTML = outputFormula;
    document.getElementById('condition-text').innerHTML = condition;
    document.getElementById('result-container').style.display = 'block';

    // MathJaxで数式を再レンダリング
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise().catch(err => console.log(err));
    }
}

// キーボードのEnterキーで計算実行
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateTransform();
            }
        });
    });
});