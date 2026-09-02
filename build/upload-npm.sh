rm -rf ./build/upload.log
echo "创建时间：" `date "+%Y-%m-%d %H:%M:%S"` | tee -a ./build/upload.log
echo "-------------------------------------" | tee -a ./build/upload.log

# 宝信私仓上传地址
repurl=http://10.25.102.19:8081
repname=iplat-npm-hosted
repository=$repurl/repository/$repname/
echo "repository: $repository"

cache_path=./npm-packages-offline-cache
echo "cache_path: $pwd/$cache_path"

echo "Searching tgz file..."
for package in $cache_path/*.tgz; do
  echo "查询包 $package"
  # package=./npm-packages-offline-cache/@achrinza-node-ipc-9.2.6.tgz
  pkgname_detail=${package#$cache_path/}
  pkgname_detail=${pkgname_detail%.*}
  # echo $pkgname
  if [[ $pkgname_detail = '@'* ]] ;then
    pkgname=${pkgname_detail#@}
    group=${pkgname%%-*}
    # echo "group: $group"
    version=${pkgname%-[0-9]*.[0-9]*.[0-9]*}
    version=${pkgname#$version-}
    # echo "version: $version"
    name=${pkgname#$group-}
    name=${name%-$version}
    # echo "name: $name"
    requesturl=$repurl'/service/rest/v1/search?repository='$repname'&group='$group'&name='$name'&version='$version
    # echo $requesturl
    if curl -s -X 'GET' $requesturl | grep -q '"name" : "'$name'"' ;then
      echo "$pkgname_detail 包已存在" | tee -a ./build/upload.log
    else
      echo "$pkgname_detail 准备发布包" | tee -a ./build/upload.log
      # npm publish --registry=$repository $package
      curl -s -u admin:admin910 -w '  status_code: %{http_code}\n' -X 'POST' \
        $repurl'/service/rest/v1/components?repository='$repname -H 'Content-Type: multipart/form-data' \
        -F 'npm.asset=@'$package';type=application/x-compressed' | tee -a ./build/upload.log
    fi
  else
    version=${pkgname_detail%-[0-9]*.[0-9]*.[0-9]*}
    version=${pkgname_detail#$version-}
    # echo "version: $version"
    name=${pkgname_detail%-$version}
    # echo "name: $name"
    requesturl=$repurl'/service/rest/v1/search?repository='$repname'&name='$name'&version='$version
    if curl -s -X 'GET' $requesturl | grep -q '"name" : "'$name'"' ;then
      echo "$pkgname_detail 包已存在" | tee -a ./build/upload.log
    else
      echo "$pkgname_detail 准备发布包" | tee -a ./build/upload.log
      # npm publish --registry=$repository $package
      curl -s -u admin:admin910 -w '  status_code: %{http_code}\n' -X 'POST' \
        $repurl'/service/rest/v1/components?repository='$repname -H 'Content-Type: multipart/form-data' \
        -F 'npm.asset=@'$package';type=application/x-compressed' | tee -a ./build/upload.log
    fi
  fi
done
echo "--- 上传完成！---"
