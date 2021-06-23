"use strict";

var gulp = require("gulp"),
    gulpSass = require("gulp-sass"),
    gulpPlugin = require('gulp-load-plugins')(),
    gulpSourcemaps = require("gulp-sourcemaps"),
    gulpBrowserify = require("gulp-browserify"),
    gulpRunSequence = require("run-sequence"),
    gulpSpriteSmith = require("gulp.spritesmith"),
    gulpAutoprefixr = require("gulp-autoprefixer"),
    mergeStream = require("merge-stream"),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifycss =require('gulp-minify-css'),

    //SCSS lint
    gulpScssLint = require("gulp-scss-lint"),
    xtend = require("xtend"),
    argv = require("yargs").argv,
    path = require("path"),
    rootPath = argv.JenkinsCartridgesPath || __dirname,

    //SYNC
    dirSync = require( 'gulp-directory-sync' ),
    gutil = require('gulp-util'),
    //webpack latam configuration
    webpack = require('webpack-stream'),
    devBuild = process.env.NODE_ENV || 'production';
    
/** Sync paths */
var SYNC_PATHS = [
    {
        scss: [
            {
                src: 'app_sephora_basic/cartridge/scss',
                dst: 'static_temp_latam/cartridge/scss',
                opt: {}
            },
            {
                src: 'app_sephora_basic_latam/cartridge/scss',
                dst: 'static_temp_latam/cartridge/scss',
                opt: {nodelete: true}
            }
        ],
        js: [
            {
                src: 'app_sephora_basic/cartridge/js',
                dst: 'static_temp_latam/cartridge/js',
                opt: {}
            },
            {
                src: 'app_sephora_basic_latam/cartridge/js',
                dst: 'static_temp_latam/cartridge/js',
                opt: {nodelete: true}
            }
        ],
        static: [
            {
                src: 'app_sephora_basic/cartridge/static/default',
                dst: 'static_temp_latam/cartridge/static/default',
                opt: {}
            },
            {
                src: 'app_sephora_basic_latam/cartridge/static/default',
                dst: 'static_temp_latam/cartridge/static/default',
                opt: {nodelete: true}
            }
        ]
    },
    {
        scss: [
            {
                src: 'app_sephora_basic/cartridge/scss',
                dst: 'static_temp_extended_latam/cartridge/scss',
                opt: {}
            },
            {
                src: 'app_sephora_basic_latam/cartridge/scss',
                dst: 'static_temp_extended_latam/cartridge/scss',
                opt: {nodelete: true}
            },
            {
                src: 'app_sephora_extended_latam/cartridge/scss',
                dst: 'static_temp_extended_latam/cartridge/scss',
                opt: {nodelete: true}
            },
        ],
        js: [
            {
                src: 'app_sephora_basic/cartridge/js',
                dst: 'static_temp_extended_latam/cartridge/js',
                opt: {}
            },
            {
                src: 'app_sephora_basic_latam/cartridge/js',
                dst: 'static_temp_extended_latam/cartridge/js',
                opt: {nodelete: true}
            },
            {
                src: 'app_sephora_extended_latam/cartridge/js',
                dst: 'static_temp_extended_latam/cartridge/js',
                opt: {nodelete: true}
            },
        ],
        static: [
            {
                src: 'app_sephora_basic/cartridge/static/default',
                dst: 'static_temp_extended_latam/cartridge/static/default',
                opt: {}
            },
            {
                src: 'app_sephora_basic_latam/cartridge/static/default',
                dst: 'static_temp_extended_latam/cartridge/static/default',
                opt: {nodelete: true}
            },
            {
                src: 'app_sephora_extended_latam/cartridge/static/default',
                dst: 'static_temp_extended_latam/cartridge/static/default',
                opt: {nodelete: true}
            }
        ]
    }
]

/* JavaScript paths */
var JS_PATHS = [
    {
        wtc: 'app_sephora_core/cartridge/js/**/*.js',
        src: 'app_sephora_core/cartridge/js/app.js',
        dst: 'app_sephora_core/cartridge/static/default/js',
    },
    {
        wtc: 'app_sephora_basic/cartridge/js/**/*.js',
        src: 'app_sephora_basic/cartridge/js/app.js',
        dst: 'app_sephora_basic/cartridge/static/default/js',
    },
    {
        wtc: 'app_sephora_basic_latam/cartridge/js/**/*.js',
        src: 'app_sephora_basic/cartridge/js/app.js',
        dst: 'app_sephora_basic_latam/cartridge/static/default/js',
    },
    {
        wtc: 'int_target2sell/cartridge/static/default/js/**/*.js',
        src: 'int_target2sell/cartridge/static/default/js/searchrank.js',
        dst: 'app_sephora_basic/cartridge/static/default/lib',
    },
    {
        wtc: 'app_sephora_extended/cartridge/js/**/*.js',
        src: 'app_sephora_extended/cartridge/js/app_common.js',
        dst: 'app_sephora_extended/cartridge/static/default/js',
    },
    {
        wtc: 'app_sephora_extended/cartridge/js/**/*.js',
        src: 'app_sephora_extended/cartridge/js/app_search.js',
        dst: 'app_sephora_extended/cartridge/static/default/js',
    },
    {
        wtc: 'app_sephora_extended/cartridge/js/**/*.js',
        src: 'app_sephora_extended/cartridge/js/app_storefront.js',
        dst: 'app_sephora_extended/cartridge/static/default/js',
    },
    {
        wtc: 'app_sephora_extended/cartridge/js/**/*.js',
        src: 'app_sephora_extended/cartridge/js/app_product.js',
        dst: 'app_sephora_extended/cartridge/static/default/js',
    },
    {
        wtc: 'app_sephora_extended/cartridge/js/**/*.js',
        src: 'app_sephora_extended/cartridge/js/app_checkout.js',
        dst: 'app_sephora_extended/cartridge/static/default/js',
    },
    {
        wtc: 'int_target2sell/cartridge/static/default/js/**/*.js',
        src: 'int_target2sell/cartridge/static/default/js/searchrank.js',
        dst: 'app_sephora_extended/cartridge/static/default/lib',
    },
    {
        wtc: 'app_sephora_csv2/cartridge/js/**/*.js',
        src: 'app_sephora_csv2/cartridge/js/app_customerservice.js',
        dst: 'app_sephora_csv2/cartridge/static/default/js',
    },
    {
        wtc: 'app_sephora_basic_latam/cartridge/js/**/*.js',
        src: 'static_temp_latam/cartridge/js/app.js',
        dst: 'app_sephora_basic_latam/cartridge/static/default/js',
    },
    {
        wtc: 'app_sephora_extended_latam/cartridge/js/**/*.js',
        src: 'static_temp_extended_latam/cartridge/js/app.js',
        dst: 'app_sephora_extended_latam/cartridge/static/default/js',
    },
    
];

/* Sprite paths */
var SPRITE_PATHS = [
    {
        wtc: 'app_sephora_core/cartridge/static/default/images/sprite/*.png',
        src: 'app_sephora_core/cartridge/static/default/images/sprite/*.png',
        img: 'app_sephora_core/cartridge/static/default/images',
        css: 'app_sephora_core/cartridge/scss/default',
    },
    {
        wtc: 'app_sephora_basic/cartridge/static/default/images/sprite/*.png',
        src: 'app_sephora_basic/cartridge/static/default/images/sprite/*.png',
        img: 'app_sephora_basic/cartridge/static/default/images',
        css: 'app_sephora_basic/cartridge/scss/default',
    },
    {
        wtc: 'app_sephora_extended/cartridge/static/default/images/sprite/*.png',
        src: 'app_sephora_extended/cartridge/static/default/images/sprite/*.png',
        img: 'app_sephora_extended/cartridge/static/default/images',
        css: 'app_sephora_extended/cartridge/scss/default',
    },
    {
        wtc: 'app_sephora_basic_latam/cartridge/static/default/images/sprite/*.png',
        src: 'static_temp_latam/cartridge/static/default/images/sprite/*.png',
        css: 'app_sephora_basic_latam/cartridge/scss/default',
        img: 'app_sephora_basic_latam/cartridge/static/default/images',
    },
    {
        wtc: 'app_sephora_basic_latam/cartridge/static/default/images/sprite/*.png',
        src: 'static_temp_latam/cartridge/static/default/images/sprite/*.png',
        css: 'static_temp_latam/cartridge/scss/default',
        img: 'app_sephora_basic_latam/cartridge/static/default/images',
    },
    {
        wtc: 'app_sephora_extended_latam/cartridge/static/default/images/sprite/*.png',
        src: 'static_temp_extended_latam/cartridge/static/default/images/sprite/*.png',
        css: 'app_sephora_extended_latam/cartridge/scss/default',
        img: 'app_sephora_extended_latam/cartridge/static/default/images',
    },
    {
        wtc: 'app_sephora_extended_latam/cartridge/static/default/images/sprite/*.png',
        src: 'static_temp_extended_latam/cartridge/static/default/images/sprite/*.png',
        css: 'static_temp_extended_latam/cartridge/scss/default',
        img: 'app_sephora_extended_latam/cartridge/static/default/images',
    },
];

/* SCSS paths */
var SCSS_PATHS = [
    {
        wtc: 'app_sephora_core/cartridge/scss/default/**/*.scss',
        src: 'app_sephora_core/cartridge/scss/default/style.scss',
        dst: 'app_sephora_core/cartridge/static/default/css/',
    },
    {
        wtc: 'app_sephora_basic/cartridge/scss/default/**/*.scss',
        src: 'app_sephora_basic/cartridge/scss/default/style.scss',
        dst: 'app_sephora_basic/cartridge/static/default/css/',
    },
    {
        wtc: 'app_sephora_extended/cartridge/scss/default/**/*.scss',
        src: 'app_sephora_extended/cartridge/scss/default/style.scss',
        dst: 'app_sephora_extended/cartridge/static/default/css/'
    },
    {
        wtc: 'app_sephora_extended/cartridge/scss/default/**/*.scss',
        src: 'app_sephora_extended/cartridge/scss/rtl/style.scss',
        dst: 'app_sephora_extended/cartridge/static/rtl/css/',
    },
    {
        wtc: 'app_sephora_csv2/cartridge/scss/default/**/*.scss',
        src: 'app_sephora_csv2/cartridge/scss/default/customerservice.scss',
        dst: 'app_sephora_csv2/cartridge/static/default/css/',
    },
    {
        wtc: 'app_sephora_extended/cartridge/scss/default/**/*.scss',
        src: 'app_sephora_extended/cartridge/scss/default/style_storefront.scss',
        dst: 'app_sephora_extended/cartridge/static/default/css/'
    },
    {
        wtc: 'app_sephora_extended/cartridge/scss/default/**/*.scss',
        src: 'app_sephora_extended/cartridge/scss/default/style_search.scss',
        dst: 'app_sephora_extended/cartridge/static/default/css/'
    },
    {
        wtc: 'app_sephora_extended/cartridge/scss/default/**/*.scss',
        src: 'app_sephora_extended/cartridge/scss/default/style_product.scss',
        dst: 'app_sephora_extended/cartridge/static/default/css/'
    },
    {
        wtc: 'app_sephora_basic_latam/cartridge/scss/default/**/*.scss',
        src: 'static_temp_latam/cartridge/scss/default/style.scss',
        dst: 'app_sephora_basic_latam/cartridge/static/default/css/',
    },
    {
        wtc: 'app_sephora_extended_latam/cartridge/scss/default/**/*.scss',
        src: 'static_temp_extended_latam/cartridge/scss/default/style.scss',
        dst: 'app_sephora_extended_latam/cartridge/static/default/css/',
    },
];

/* MIN CSS paths */
var MIN_CSS_PATHS = [
    {
        src: 'static_temp_latam/cartridge/static/default/css/fonts.css',
        dst: 'app_sephora_basic_latam/cartridge/static/default/css/',
        name: 'fonts.min.css',
    },
    {
        src: 'static_temp_extended_latam/cartridge/static/default/css/fonts.css',
        dst: 'app_sephora_extended_latam/cartridge/static/default/css/',
        name: 'fonts.min.css',
    },
];

/* MIN JS paths */
var MIN_JS_PATHS = [
    {
        src: 'app_sephora_basic/cartridge/static/default/lib/jquery/jquery.unveil.js',
        dst: 'app_sephora_basic/cartridge/static/default/lib/jquery/',
        name: 'jquery.unveil.min.js',
    },
    {
        src: 'app_sephora_basic_latam/cartridge/static/default/lib/jquery/jquery.mask.js',
        dst: 'app_sephora_basic_latam/cartridge/static/default/lib/jquery/',
        name: 'jquery.mask.min.js',
    },
    {
        src: 'app_sephora_basic/cartridge/static/default/lib/beautyboard.js',
        dst: 'app_sephora_basic/cartridge/static/default/lib/',
        name: 'beautyboard.min.js',
    },
];

/* Global */
var syncAction = function(syncAttr){
    var streams = mergeStream();

    SYNC_PATHS.forEach(function(syncBlock){
        syncBlock[syncAttr].forEach(function(path){
            streams.add(
                gulp.src('')
                .pipe( dirSync( path.src, path.dst, path.opt ) )
                .on('error', gutil.log)
            )
        })
    });

    return streams;
}

/* Gulp tasks */
gulp.task("js", function () {

    /* Latam sync cartridges base javascript files in temporal folder */
    syncAction('js')

    var streams = mergeStream();

    JS_PATHS.forEach(function (p) {
        var srcPath = path.join(rootPath, p.src),
            dstPath = path.join(rootPath, p.dst),
            optBrfy = {
                "transform": ['dotify'],
                "debug": true
            };

        // Needed when task is run from Jenkins so that Browserify can resolve the modules installed with NPM
        if (argv.JenkinsNodeModulesPath) {
            optBrfy = xtend(optBrfy, {
                paths: [argv.JenkinsNodeModulesPath]
            });
        }

        if(/(_latam)/g.test(srcPath)){
            // webpack configuration for latam js copiled version
            streams.add(gulp.src(srcPath)
                .pipe( webpack( {
                    entry: {
                        app: srcPath,
                    },
                    output: {
                        path: dstPath,
                        filename: 'app.js',
                    },
                    mode: devBuild != 'development' ? devBuild: 'development',
                    devtool: devBuild != 'development' ? false: 'source-map',
                    module: {
                        rules: [{
                            test: /\.m?js$/,
                            exclude: /(bower_components)/,
                            use: {
                                loader: "babel-loader",
                                options: {
                                    presets: ["@babel/preset-env"],
                                },
                            },
                        },]
                    } 
                } ))
                .pipe(gulp.dest(dstPath)));
        }
        else{
            streams.add(gulp.src(srcPath)
                .pipe(gulpBrowserify(optBrfy))
                .pipe(gulp.dest(dstPath)));
        }

    });

    streams.add(
        gulp.src(path.join(rootPath, 'int_dqe/cartridge/static/default/lib/dqe/*.js'))
        .pipe(concat('dqe_app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.join(rootPath, 'app_sephora_extended/cartridge/static/default/js/'))))

    return streams;
});

// create sprite
gulp.task("sprite", function () {

    /* Latam sync cartridges base static files in temporal folder */
    syncAction('static')

    var streams = mergeStream();

    SPRITE_PATHS.forEach(function (p) {
        var srcPath = path.join(rootPath, p.src),
            imgPath = path.join(rootPath, p.img),
            cssPath = path.join(rootPath, p.css),
            spriteData = gulp.src(srcPath).pipe(gulpSpriteSmith({
                imgName: "sprites.png",
                cssName: "_sprite.scss",
                cssFormat: "scss",
                padding: 20,
                algorithm: "top-down",
                imgPath: "../images/sprites.png",
                cssVarMap: function (sprite) {
                    sprite.name = sprite.name.toLowerCase();
                },
                cssTemplate: "spriteTemplate.handlebars"
            }));

        streams.add(spriteData.img.pipe(gulp.dest(imgPath)));
        streams.add(spriteData.css.pipe(gulp.dest(cssPath)));
    });

    return streams;
});

// generate css
gulp.task("scss", function () {

    /* Latam sync cartridges base scss files in temporal folder */
    syncAction('scss');

    var streams = mergeStream();

    SCSS_PATHS.forEach(function (p) {
        var srcPath = path.join(rootPath, p.src),
            dstPath = path.join(rootPath, p.dst);

        if(devBuild != 'development'){
            streams.add(gulp.src(srcPath)
                .pipe(gulpSass({outputStyle: 'compressed'}))
                .pipe(gulpAutoprefixr({
                    browsers: ['> 0.1%']
                }))
                .pipe(gulp.dest(dstPath)));
        }
        else{
            streams.add(gulp.src(srcPath)
                .pipe(gulpSourcemaps.init())
                .pipe(gulpSass({
                    "errLogToConsole": true,
                    "sourceComments": true
                }))
                .pipe(gulpAutoprefixr({
                    browsers: ['> 0.1%']
                }))
                .pipe(gulpSourcemaps.write())
                .pipe(gulp.dest(dstPath)));
        }


    });

    return streams;
});

//SCSS Lint
gulp.task('scsslint', function () {
    var streams = mergeStream();
    SCSS_PATHS.forEach(function (p) {
        streams.add(gulp.src(p.src)
            .pipe(gulpScssLint(p.options)));
    });
    return streams;
});

// minifying third party libraries
gulp.task('minify-css', function () {

    /* Latam sync cartridges base static files in temporal folder */
    syncAction('static');

    var streams = mergeStream();

    MIN_CSS_PATHS.forEach(function (p) {
        var srcPath = path.join(rootPath, p.src),
            dstPath = path.join(rootPath, p.dst);

            streams.add(gulp.src(srcPath)
            .pipe(concat(p.name))
            .pipe(minifycss())
            .pipe(gulp.dest(dstPath)));

    });

    return streams;
});

gulp.task('minify-js', function () {

    /* Latam sync cartridges base static files in temporal folder */
    syncAction('static');

    var streams = mergeStream();

    MIN_JS_PATHS.forEach(function (p) {
        var srcPath = path.join(rootPath, p.src),
            dstPath = path.join(rootPath, p.dst);

            streams.add(gulp.src(srcPath)
            .pipe(concat(p.name))
            .pipe(uglify())
            .pipe(gulp.dest(dstPath)));

    });

    return streams;
});

gulp.task("watch", ["sprite"], function () {
    gulpRunSequence("scss", "js");

    SPRITE_PATHS.forEach(function (p) {
        gulp.watch(path.join(rootPath, p.wtc), ["sprite"]);
    });

    SCSS_PATHS.forEach(function (p) {
        gulp.watch(path.join(rootPath, p.wtc), ["scss"]);
    });

    JS_PATHS.forEach(function (p) {
        gulp.watch(path.join(rootPath, p.wtc), ["js"]);
    });

    gulp.watch(path.join(rootPath, 'int_dqe/cartridge/static/default/lib/dqe/*.js'), ["js"]);

});

gulp.task("default", ["sprite", "scss", "scsslint", "js", "minify-css", "minify-js"]);
