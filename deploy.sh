rm -rf build
git clone git@github.com:davidsiaw/alesap build
cd build
git checkout gh-pages
cd ..
mv build/.git gitbak
rm -rf build
mkdir -p build/weaver
sleep 2
bundle exec weaver build --root=alesap.astrobunny.net
mv gitbak build/.git
cd build
echo alesap.astrobunny.net > CNAME
git add .
git commit -m "update"
git push
cd ..
