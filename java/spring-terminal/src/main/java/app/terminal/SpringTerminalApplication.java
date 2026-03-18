package app.terminal;

import java.util.Scanner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringTerminalApplication {

  static void main(String[] args) {
    SpringApplication.run(SpringTerminalApplication.class, args);
    System.out.print("please input：");
    var scanner=new Scanner(System.in);
    var input = scanner.nextLine();
    System.out.println("你的输入：" + input);
  }
}
