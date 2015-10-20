var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var merge = require('merge-stream');
var runseq = require('run-sequence');
var mocha = require('gulp-mocha');

var path_config = {
	src: {
		ts_config: 'src/lib/tsconfig.json'
	},
	test: {
		ts_config: 'src/test/mocha/tsconfig.json',
		dest: 'test',
		clean: ['test/**/*','src/test/**/*.js','src/test/**/*.js.map','src/lib/**/*.js','src/lib/**/*.js.map']
	},
	out: {
		dest: 'release',
		def_dest: 'release/definitions',
		clean: ['release/**/*']
	}
};

function buildTypeScript(tsProject) {
	return tsProject.src({ base: "" })
		.pipe(sourcemaps.init())
		.pipe(ts(tsProject));
}

function addSourceMap(gulpStream){
	return gulpStream.pipe(
        sourcemaps.write('.', {
            sourceRoot: function (file) { return ''; },
            includeContent: false
        }));
}

gulp.task('compile:src', function () {
	var tsProject = ts.createProject(path_config.src.ts_config);
	var tsResult = buildTypeScript(tsProject);
	return merge(
		addSourceMap(tsResult.js).pipe(gulp.dest(path_config.out.dest)),
		tsResult.dts.pipe(gulp.dest(path_config.out.def_dest))
	);
	
});

gulp.task('copy:build',function(){
	return gulp.src(path_config.out.clean).pipe(gulp.dest(path_config.test.dest))
})

gulp.task('compile:test', function () {
	var tsProject = ts.createProject(path_config.test.ts_config);
	var tsResult = buildTypeScript(tsProject);
	return addSourceMap(tsResult.js)
        .pipe(gulp.dest(path_config.test.dest));
});

gulp.task('clean:src', function () {
	return gulp.src(path_config.out.clean).pipe(vinylPaths(del));
});

gulp.task('clean:test', function(){
	return gulp.src(path_config.test.clean).pipe(vinylPaths(del));
});

gulp.task('build',function(callback){
	return runseq('clean:src','compile:src',callback);
});

gulp.task('build:test',function(callback){
	return runseq('compile:src','compile:test',callback);
});

gulp.task('test:mocha', function () {
    return gulp.src([path_config.test.dest + '/**/*.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha());
});

gulp.task('test',function(callback){
	return runseq(['build:test','test:mocha'])
});