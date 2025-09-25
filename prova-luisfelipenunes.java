import java.util.Scanner;
import java.util.Locale;

public class Main {

    static class ContaBancaria {
        private int numeroConta;
        private String nomeTitular;
        private double saldo;
        private static final double TAXA_SAQUE = 5.00;

        public ContaBancaria(int numeroConta, String nomeTitular, double saldoInicial) {
            this.numeroConta = numeroConta;
            this.nomeTitular = nomeTitular;
            this.saldo = saldoInicial;
        }

        public int getNumeroConta() {
            return numeroConta;
        }

        public String getNomeTitular() {
            return nomeTitular;
        }

        public void setNomeTitular(String nomeTitular) {
            this.nomeTitular = nomeTitular;
        }

        public double getSaldo() {
            return saldo;
        }

        public void deposito(double valor) {
            if (valor > 0) {
                saldo += valor;
            } else {
                System.out.println("Valor de depósito inválido. Deve ser maior que zero.");
            }
        }

        public void saque(double valor) {
            if (valor > 0) {
                if (saldo >= valor + TAXA_SAQUE) {
                    saldo -= (valor + TAXA_SAQUE);
                } else {
                    System.out.println("Saldo insuficiente para completar o saque.");
                }
            }
        }

        @Override
        public String toString() {
            return String.format("Conta %d, Titular: %s, Saldo: $ %.2f", numeroConta, nomeTitular, saldo);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in).useLocale(Locale.US);

        System.out.println("Entre com os dados da conta:");
        System.out.print("Número da conta: ");
        int numero = sc.nextInt();
        sc.nextLine();
        System.out.print("Nome do titular: ");
        String titular = sc.nextLine();
        System.out.print("Saldo inicial: ");
        double saldoInicial = sc.nextDouble();

        ContaBancaria conta = new ContaBancaria(numero, titular, saldoInicial);
        System.out.println("\nDados da conta: " + conta);

        System.out.print("\nEntre com o valor do depósito: ");
        double valorDeposito = sc.nextDouble();
        conta.deposito(valorDeposito);
        System.out.println("Dados atualizados: " + conta);

        System.out.print("\nEntre com o valor do saque: ");
        double valorSaque = sc.nextDouble();
        conta.saque(valorSaque);
        System.out.println("Dados atualizados: " + conta);

        sc.close();
    }
}