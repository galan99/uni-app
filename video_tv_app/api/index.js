import {
	get,
	post
} from "@/utils/request.js"

let url = "http://localhost:3003"


export function getHomeDataList(data) {
	return post({
		cmd: "/video/getHomeData",
		data: data
	})
}

export function getFilterList(data) {
	return post({
		cmd: "/video/getFilterList",
		data: data
	})
}

export function getFilterVideo(data) {
	return post({
		cmd: "/video/getFilterVideo",
		data: data
	})
}

export function getVideoDetail(data) {
	return post({
		cmd: "/video/getVideoDesc",
		data: data
	})
}

export function getVideoList(data) {
	return post({
		cmd: "/video/getVideoList",
		data: data
	})
}

export function getVideoUrl(data){
	return post({
		cmd: "/video/getVideoUrl",
		data: data
	})
}

export function getVideoSearchList(data){
	return post({
		cmd: "/video/getVideoSearchList",
		data: data
	})
}

export function getVideoWord(data){
	return post({
		cmd: "/video/getVideoWord",
		data: data
	})
}


