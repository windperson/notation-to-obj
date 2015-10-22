var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var path = require('path');
var merge = require('merge-stream');
var runseq = require('run-sequence');
var mocha = require('gulp-mocha');

var build_folder = 'build';

var path_config = {
	src: {
		ts_config: 'src/lib/tsconfig.json'
	},
	out: {
		dest: path.join(build_folder, 'release'),
		def_dest: path.join(build_folder, 'release', 'definitions'),
		clean: [path.join(build_folder, 'release') + '/**/*']
	},
	test: {
		ts_config: 'src/test/mocha/tsconfig.json',
		dest: path.join(build_folder, 'test'),
		clean: [path.join(build_folder, 'test') + '/**/*']
	}
};

function buildTypeScript(tsProject) {
	return tsProject.src({ base: "" })
		.pipe(sourcemaps.init())
		.pipe(ts(tsProject));
}

function addSourceMap(gulpStream) {
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

gulp.task('copy:build', function () {
	var buildDest = path.join(path_config.test.dest, './lib');
	return gulp.src(path_config.out.clean).pipe(gulp.dest(buildDest))
})

gulp.task('compile:test', function () {
	var tsProject = ts.createProject(path_config.test.ts_config);
	var tsResult = buildTypeScript(tsProject);
	var testDest = path.join(path_config.test.dest, './test_code/mocha');
	return addSourceMap(tsResult.js)
        .pipe(gulp.dest(testDest));
});

gulp.task('clean:src', function () {
	return gulp.src(path_config.out.clean, { read: false })
		.pipe(vinylPaths(del)).pipe(gulp.dest(path_config.out.dest));
});

gulp.task('clean:test', function () {
	return del(path_config.test.dest);
});

gulp.task('clean', function (callback) {
	return runseq(['clean:src', 'clean:test'], callback);
})

gulp.task('build', function (callback) {
	return runseq('clean:src', 'compile:src', callback);
});

gulp.task('build:test', function (callback) {
	return runseq(['compile:src', 'compile:test'], 'copy:build', callback);
});

gulp.task('test:mocha', function () {
    return gulp.src([path_config.test.dest + '/test_code/mocha/**/*.js'], { read: false })
	// gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha());
});

gulp.task('test', function (callback) {
	return runseq('build:test', 'test:mocha')
});

gulp.task('default', function (callback) {
	return runseq('build', callback);
});