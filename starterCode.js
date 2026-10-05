export const STARTER = {
  python: `num = 10

if num % 2 == 0:
    print("Even")
else:
    print("Odd")`,

  python3: `num = 10

if num % 2 == 0:
    print("Even")
else:
    print("Odd")`,

  c: `#include <stdio.h>
int main(){
    int num=10;
    if(num%2==0) printf("Even\\n");
    else printf("Odd\\n");
    return 0;
}`,

  cpp: `#include <bits/stdc++.h>
using namespace std;
int main(){
    int num=10;
    if(num%2==0) cout<<"Even";
    else cout<<"Odd";
    return 0;
}`,

  java: `public class Main{
    public static void main(String[] args){
        int num=10;
        if(num%2==0) System.out.println("Even");
        else System.out.println("Odd");
    }
}`
};

export const LANGUAGE_NAMES = {
  python: "Python",
  python3: "Python3",
  c: "C",
  cpp: "C++",
  java: "Java"
};
