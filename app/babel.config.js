module.exports = function (api) {
    api.cache(true);

    const presets = [
        "@babel/preset-env",
        "@babel/preset-react",
    ];
    const plugins = [
        "@babel/plugin-syntax-object-rest-spread",
        ["@babel/plugin-proposal-class-properties", {"loose": true}],
        "transform-react-remove-prop-types",
        // ["transform-react-remove-prop-types", {"mode": "wrap", "ignoreFilenames": ["node_modules"]}],
    ];

    return {
        presets,
        plugins
    };
};